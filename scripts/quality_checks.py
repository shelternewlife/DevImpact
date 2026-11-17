#!/usr/bin/env python3
"""Dependency-free DevImpact static-site quality gate."""
import json, sys, time, urllib.error, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://shelternewlife.github.io/DevImpact"
ERRORS, WARNINGS, EXTERNAL = [], [], set()

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links=[]; self.meta={}; self.canonicals=[]; self.alternates=[]; self.title_text=[]; self.in_title=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag in ("a","link","script","img","source"):
            for k in ("href","src"):
                if a.get(k): self.links.append((tag,k,a[k]))
        if tag=="meta":
            key=a.get("name") or a.get("property")
            if key: self.meta[key.lower()]=a.get("content","")
        if tag=="link" and a.get("rel")=="canonical": self.canonicals.append(a.get("href",""))
        if tag=="link" and a.get("rel")=="alternate" and a.get("hreflang"): self.alternates.append((a["hreflang"],a.get("href","")))
        if tag=="title": self.in_title=True
    def handle_endtag(self, tag):
        if tag=="title": self.in_title=False
    def handle_data(self, data):
        if self.in_title: self.title_text.append(data)

def fail(s): ERRORS.append(s)
def get_pages(): return sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts)
def url_for(p):
    rel=p.relative_to(ROOT).as_posix()
    return BASE + ("/" if rel=="index.html" else "/" + rel.removesuffix("index.html"))

def local_target(url, current):
    u=urllib.parse.urlsplit(url)
    if url.startswith(("data:","mailto:","tel:","javascript:")): return None
    if u.netloc and u.netloc not in ("shelternewlife.github.io",): return None
    path=urllib.parse.unquote(u.path)
    if u.netloc=="shelternewlife.github.io" and not path.startswith("/DevImpact/"): return None
    if not path: return current
    if path.startswith("/DevImpact/"): path=path[len("/DevImpact/"):]
    elif path.startswith("/"): path=path.lstrip("/")
    else: path=(current.parent / path).as_posix()
    p=(ROOT/path).resolve()
    try: p.relative_to(ROOT.resolve())
    except ValueError: return None
    return p/"index.html" if p.is_dir() else p

def check_catalog():
    data=json.loads((ROOT/"data/apps.json").read_text(encoding="utf-8")); apps=data["apps"]
    ids=[a["id"] for a in apps]; pkgs=[a["package"] for a in apps]
    if len(apps)!=10: fail("Expected 10 catalogue entries, found "+str(len(apps)))
    if len(ids)!=len(set(ids)): fail("Duplicate app IDs")
    if len(pkgs)!=len(set(pkgs)): fail("Duplicate Android package IDs")
    for a in apps:
        for k in ("id","name","package","description","page","arabicPage","category","kind"):
            if not a.get(k): fail(a.get("id","?")+" missing "+k)
        for k in ("page","arabicPage"):
            p=ROOT/a[k].lstrip("/")
            if p.is_dir(): p=p/"index.html"
            if not p.is_file(): fail(a["id"]+" missing "+a[k])
            elif a["package"] not in p.read_text(encoding="utf-8"): fail(a["id"]+" package ID absent from "+a[k])
    print("Catalogue: "+str(len(apps))+" apps; unique IDs and package names")

def check_pages():
    ps=get_pages(); known={url_for(p):p for p in ps}
    for p in ps:
        rel=p.relative_to(ROOT).as_posix()
        if rel=="404.html": continue
        h=Page()
        try: h.feed(p.read_text(encoding="utf-8"))
        except Exception as e: fail(rel+" HTML parse error: "+str(e)); continue
        expected=url_for(p)
        if len(h.canonicals)!=1: fail(rel+" must contain exactly one canonical")
        elif h.canonicals[0].rstrip("/")!=expected.rstrip("/"): fail(rel+" canonical mismatch")
        if not "".join(h.title_text).strip(): fail(rel+" missing title")
        if not h.meta.get("description"): fail(rel+" missing meta description")
        for k in ("og:title","og:description","og:url"):
            if not h.meta.get(k): WARNINGS.append(rel+" missing "+k)
        if not h.meta.get("og:image"): WARNINGS.append(rel+" missing og:image")
        if not h.meta.get("twitter:card"): WARNINGS.append(rel+" missing twitter:card")
        langs={x[0] for x in h.alternates}
        if not {"en","ar","x-default"}.issubset(langs): WARNINGS.append(rel+" missing complete en/ar/x-default hreflang")
        for lang,u in h.alternates:
            if u not in known: fail(rel+" hreflang "+lang+" target missing: "+u)
        for tag,attr,u in h.links:
            z=urllib.parse.urlsplit(u)
            if z.scheme in ("http","https") and z.netloc and z.netloc!="shelternewlife.github.io":
                EXTERNAL.add(urllib.parse.urlunsplit((z.scheme,z.netloc,z.path,z.query,"")) )
            t=local_target(u,p)
            if t and not t.exists(): fail(rel+" broken local "+attr+"="+u)
    print("HTML: checked "+str(len(ps))+" pages, canonical, metadata, hreflang and local references")
    return ps

def check_sitemap(ps):
    try: root=ET.parse(ROOT/"sitemap.xml").getroot()
    except Exception as e: fail("Invalid sitemap.xml: "+str(e)); return
    ns={"s":"http://www.sitemaps.org/schemas/sitemap/0.9","x":"http://www.w3.org/1999/xhtml"}
    urls=[n.text.strip() for n in root.findall("s:url/s:loc",ns) if n.text]
    if not urls: fail("Sitemap has no URLs")
    if len(urls)!=len(set(urls)): WARNINGS.append("Sitemap contains duplicate URLs; de-duplicate during sitemap rebuild")
    known={url_for(p) for p in ps if p.relative_to(ROOT).as_posix()!="404.html"}
    for u in urls:
        if u not in known: fail("Sitemap URL has no HTML page: "+u)
    for node in root.findall("s:url",ns):
        loc=node.findtext("s:loc",default="",namespaces=ns)
        alts=node.findall("x:link",ns)
        langs={a.attrib.get("hreflang") for a in alts}
        if not {"en","ar","x-default"}.issubset(langs): WARNINGS.append("Sitemap hreflang incomplete: "+loc)
        for a in alts:
            if a.attrib.get("href") not in known: fail("Sitemap alternate target missing: "+str(a.attrib.get("href")))
    if not set(urls).issubset(known): fail("Sitemap contains URLs without HTML pages")
    if set(urls)!=known: WARNINGS.append("Sitemap does not cover every HTML page ("+str(len(set(urls)))+" URLs vs "+str(len(known))+" pages)")
    print("Sitemap: "+str(len(urls))+" unique URLs and valid alternate targets")

def external_check(url):
    req=urllib.request.Request(url,method="HEAD",headers={"User-Agent":"DevImpact-Site-Quality/1.0"})
    for attempt in range(2):
        try:
            with urllib.request.urlopen(req,timeout=12) as r: return url,r.status,""
        except urllib.error.HTTPError as e:
            if e.code in (403,405,429):
                try:
                    q=urllib.request.Request(url,headers={"User-Agent":"DevImpact-Site-Quality/1.0","Range":"bytes=0-0"})
                    with urllib.request.urlopen(q,timeout=12) as r: return url,r.status,""
                except urllib.error.HTTPError as x:
                    if x.code in (403,429,416): return url,x.code,"restricted/rate-limited"
                    return url,x.code,"HTTP error"
            if e.code>=500 and attempt==0: time.sleep(1); continue
            return url,e.code,"HTTP error"
        except Exception as e:
            if attempt==0: time.sleep(1); continue
            return url,0,str(e)
    return url,0,"request failed"

def main():
    check_catalog(); ps=check_pages(); check_sitemap(ps)
    if "--external" in sys.argv:
        with ThreadPoolExecutor(max_workers=8) as ex:
            for f in as_completed([ex.submit(external_check,u) for u in sorted(EXTERNAL)]):
                u,status,note=f.result()
                if status>=400 and note!="restricted/rate-limited": fail("External link "+str(status)+": "+u+" "+note)
                elif note: WARNINGS.append("External link not verifiable: "+u)
        print("External links: checked "+str(len(EXTERNAL))+" destinations")
    else: print("External links discovered: "+str(len(EXTERNAL))+" (network check runs in CI)")
    for w in WARNINGS: print("WARNING: "+w)
    if ERRORS:
        for e in ERRORS: print("ERROR: "+e)
        print("FAILED: "+str(len(ERRORS))+" errors"); return 1
    print("PASSED: no structural errors; "+str(len(WARNINGS))+" warnings"); return 0
if __name__=="__main__": raise SystemExit(main())
