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

class LanguageAudit(HTMLParser):
    """Detect visible Arabic script on English pages, ignoring Arabic-language controls."""
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
            "param", "source", "track", "wbr"}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.bad = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        lang = (a.get("lang") or "").lower()
        inherited = self.stack[-1][1] if self.stack else False
        skip = inherited or tag in ("script", "style", "noscript") or lang.startswith("ar")
        if tag not in self.VOID:
            self.stack.append((tag, skip))
    def handle_startendtag(self, tag, attrs):
        pass
    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break
    def handle_data(self, data):
        if not (self.stack[-1][1] if self.stack else False) and any("\u0600" <= ch <= "\u06ff" for ch in data):
            self.bad.append(data.strip())

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
        for k in ("page","arabicPage","frenchPage"):
            p=ROOT/a[k].lstrip("/")
            if p.is_dir(): p=p/"index.html"
            if not p.is_file(): fail(a["id"]+" missing "+a[k])
            elif a["package"] not in p.read_text(encoding="utf-8"): fail(a["id"]+" package ID absent from "+a[k])
    print("Catalogue: "+str(len(apps))+" apps; unique IDs and package names")

def check_pages():
    ps=get_pages(); known={url_for(p):p for p in ps}
    for p in ps:
        rel=p.relative_to(ROOT).as_posix()
        if rel in ("404.html","fr/404.html"): continue
        h=Page()
        try: h.feed(p.read_text(encoding="utf-8"))
        except Exception as e: fail(rel+" HTML parse error: "+str(e)); continue
        expected=url_for(p)
        if not rel.startswith("ar/"):
            audit = LanguageAudit()
            audit.feed(p.read_text(encoding="utf-8"))
            if audit.bad: fail(rel+" contains visible Arabic text in an English page: "+repr(audit.bad[:3]))
        if len(h.canonicals)!=1: fail(rel+" must contain exactly one canonical")
        elif h.canonicals[0].rstrip("/")!=expected.rstrip("/"):
            parts=rel.split("/",1)
            english_page=ROOT/parts[1] if len(parts)==2 and parts[0] in ("fr","ar","de","it","es","pt") else None
            english_canonical=url_for(english_page) if english_page and english_page.is_file() else None
            if not english_canonical or h.canonicals[0].rstrip("/")!=english_canonical.rstrip("/"): fail(rel+" canonical mismatch")
        if not "".join(h.title_text).strip(): fail(rel+" missing title")
        if not h.meta.get("description"): fail(rel+" missing meta description")
        for k in ("og:title","og:description","og:url"):
            if not h.meta.get(k): WARNINGS.append(rel+" missing "+k)
        if not h.meta.get("og:image"): WARNINGS.append(rel+" missing og:image")
        if not h.meta.get("twitter:card"): WARNINGS.append(rel+" missing twitter:card")
        langs={x[0] for x in h.alternates}
        if not {"en","ar","fr","x-default"}.issubset(langs): WARNINGS.append(rel+" missing complete en/ar/fr/x-default hreflang")
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

def check_blog_seo():
    """Enforce independent, locale-specific SEO targeting for every blog article."""
    articles = sorted(p for p in get_pages()
                      if p.parent.name != "blog" and "blog" in p.parts
                      and p.name == "index.html")
    by_slug = {}
    for p in articles:
        rel = p.relative_to(ROOT).as_posix()
        parts = rel.split("/")
        blog_i = parts.index("blog")
        lang = parts[0] if blog_i == 1 else "en"
        slug = parts[blog_i + 1] if blog_i + 1 < len(parts) else ""
        h = Page()
        h.feed(p.read_text(encoding="utf-8"))
        declared_lang = h.meta.get("devimpact:seo-language", "").strip().lower()
        focus = h.meta.get("devimpact:focus-keyword", "").strip()
        if declared_lang != lang:
            fail(rel + " must declare meta name=devimpact:seo-language content=" + lang)
        if not focus:
            fail(rel + " missing its locally researched devimpact:focus-keyword")
        if not "".join(h.title_text).strip() or not h.meta.get("description", "").strip():
            fail(rel + " requires a localized SEO title and meta description")
        if focus:
            by_slug.setdefault(slug, []).append((lang, " ".join(focus.casefold().split()), rel))
    for slug, entries in by_slug.items():
        seen = {}
        for lang, keyword, rel in entries:
            if keyword in seen and seen[keyword] != lang:
                fail("Blog article " + slug + " reuses the same focus keyword across " + seen[keyword] + " and " + lang + "; research a distinct local query")
            seen[keyword] = lang
    print("Blog SEO: enforced locale-specific language and focus keyword on " + str(len(articles)) + " articles")


def check_registered_keywords():
    """Enforce the permanent locale/group keyword registry on blog articles."""
    try:
        registry = json.loads((ROOT / "data/seo-keywords.json").read_text(encoding="utf-8"))
    except Exception as e:
        fail("Cannot read data/seo-keywords.json: " + str(e))
        return
    groups = registry.get("groups", {})
    languages = registry.get("languages", [])
    for group, locales in groups.items():
        for lang in languages:
            values = locales.get(lang, [])
            if not isinstance(values, list):
                fail("Keyword registry " + group + "/" + lang + " must be a list of candidate phrases")
            for value in values:
                if not isinstance(value, str) or not value.strip():
                    fail("Keyword registry contains an empty/non-text candidate: " + group + "/" + lang)
    try:
        app_ids = {a["id"] for a in json.loads((ROOT / "data/apps.json").read_text(encoding="utf-8"))["apps"]}
        for app_id in app_ids:
            if app_id not in groups:
                fail("Missing keyword group for catalogued app: " + app_id)
    except Exception as e:
        fail("Cannot validate app keyword groups: " + str(e))
    for p in get_pages():
        if p.parent.name == "blog" or "blog" not in p.parts or p.name != "index.html":
            continue
        parts = p.relative_to(ROOT).as_posix().split("/")
        blog_i = parts.index("blog")
        lang = parts[0] if blog_i == 1 else "en"
        h = Page()
        h.feed(p.read_text(encoding="utf-8"))
        group = h.meta.get("devimpact:keyword-group", "").strip()
        focus = " ".join(h.meta.get("devimpact:focus-keyword", "").casefold().split())
        if group not in groups:
            fail(p.relative_to(ROOT).as_posix() + " has unknown or missing devimpact:keyword-group")
        elif lang not in groups[group]:
            fail(p.relative_to(ROOT).as_posix() + " keyword group has no candidate locale " + lang)

def check_sitemap(ps):
    try: root=ET.parse(ROOT/"sitemap.xml").getroot()
    except Exception as e: fail("Invalid sitemap.xml: "+str(e)); return
    ns={"s":"http://www.sitemaps.org/schemas/sitemap/0.9","x":"http://www.w3.org/1999/xhtml"}
    urls=[n.text.strip() for n in root.findall("s:url/s:loc",ns) if n.text]
    if not urls: fail("Sitemap has no URLs")
    if len(urls)!=len(set(urls)): WARNINGS.append("Sitemap contains duplicate URLs; de-duplicate during sitemap rebuild")
    known={url_for(p) for p in ps if p.relative_to(ROOT).as_posix() not in ("404.html","fr/404.html")}
    for u in urls:
        if u not in known: fail("Sitemap URL has no HTML page: "+u)
    for node in root.findall("s:url",ns):
        loc=node.findtext("s:loc",default="",namespaces=ns)
        alts=node.findall("x:link",ns)
        langs={a.attrib.get("hreflang") for a in alts}
        if not {"en","ar","fr","x-default"}.issubset(langs): WARNINGS.append("Sitemap hreflang incomplete: "+loc)
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


def check_blog_publication_quality():
    """Validate objective SEO requirements for every future blog article."""
    class ArticleAudit(HTMLParser):
        def __init__(self):
            super().__init__(convert_charrefs=True)
            self.h1 = 0
            self.images_without_alt = []
            self.internal_links = 0
            self.jsonld = []
            self.in_jsonld = False
            self.buffer = []
        def handle_starttag(self, tag, attrs):
            a = dict(attrs)
            if tag == "h1": self.h1 += 1
            if tag == "img" and "alt" not in a: self.images_without_alt.append(a.get("src", "(unknown image)"))
            if tag == "a" and a.get("href", "").startswith(("/", BASE)): self.internal_links += 1
            if tag == "script" and a.get("type", "").lower() == "application/ld+json":
                self.in_jsonld = True
                self.buffer = []
        def handle_endtag(self, tag):
            if tag == "script" and self.in_jsonld:
                self.jsonld.append("".join(self.buffer))
                self.in_jsonld = False
        def handle_data(self, data):
            if self.in_jsonld: self.buffer.append(data)

    articles = sorted(p for p in get_pages() if "blog" in p.parts and p.parent.name != "blog" and p.name == "index.html")
    for p in articles:
        rel = p.relative_to(ROOT).as_posix()
        raw = p.read_text(encoding="utf-8")
        h = Page(); h.feed(raw)
        audit = ArticleAudit(); audit.feed(raw)
        parts = rel.split("/")
        bi = parts.index("blog")
        lang = parts[0] if bi == 1 else "en"
        required = ["devimpact:seo-language", "devimpact:seo-market", "devimpact:search-intent", "devimpact:content-type", "devimpact:keyword-group", "devimpact:focus-keyword"]
        for key in required:
            if not h.meta.get(key, "").strip(): fail(rel + " missing required " + key + " metadata")
        if h.meta.get("devimpact:seo-language", "").strip().lower() != lang:
            fail(rel + " SEO language does not match its URL path")
        if h.meta.get("devimpact:search-intent", "").strip().lower() not in {"informational", "commercial", "navigational", "transactional"}:
            fail(rel + " has an invalid devimpact:search-intent")
        if h.meta.get("devimpact:content-type", "").strip().lower() not in {"article", "guide", "comparison", "tutorial", "review"}:
            fail(rel + " has an invalid devimpact:content-type")
        if len(h.canonicals) != 1 or h.canonicals[0].rstrip("/") != url_for(p).rstrip("/"):
            fail(rel + " must use a self-referencing canonical URL")
        if audit.h1 != 1: fail(rel + " must contain exactly one H1")
        if audit.images_without_alt: fail(rel + " images missing alt attribute: " + ", ".join(audit.images_without_alt[:5]))
        if audit.internal_links < 2: WARNINGS.append(rel + " has fewer than two detected internal links; review contextual linking")
        if not h.meta.get("og:title") or not h.meta.get("og:description") or not h.meta.get("og:image"):
            fail(rel + " requires Open Graph title, description and image")
        if not h.meta.get("twitter:card"): fail(rel + " missing Twitter card metadata")
        if "noindex" in h.meta.get("robots", "").lower(): fail(rel + " is marked noindex")
        if not audit.jsonld: fail(rel + " requires truthful Article/BlogPosting JSON-LD")
        else:
            valid = False
            for block in audit.jsonld:
                try:
                    data = json.loads(block)
                    nodes = data if isinstance(data, list) else data.get("@graph", [data]) if isinstance(data, dict) else []
                    for node in nodes:
                        types = node.get("@type", []) if isinstance(node, dict) else []
                        if isinstance(types, str): types = [types]
                        if any(t in {"Article", "BlogPosting", "NewsArticle"} for t in types):
                            valid = True
                            for field in ("headline", "datePublished", "dateModified", "author", "image"):
                                if not node.get(field): fail(rel + " Article JSON-LD missing " + field)
                except Exception as e: fail(rel + " invalid JSON-LD: " + str(e))
            if not valid: fail(rel + " JSON-LD must include Article or BlogPosting type")
    print("Blog publication SEO: checked " + str(len(articles)) + " article pages")

def main():
    check_catalog(); ps=check_pages(); check_blog_seo(); check_registered_keywords(); check_blog_publication_quality(); check_sitemap(ps)
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
