#!/usr/bin/env python3
"""Regenerate sitemap.xml from all indexable static HTML pages."""
from pathlib import Path
from html.parser import HTMLParser
from xml.etree.ElementTree import Element, SubElement, ElementTree, register_namespace
from datetime import date
ROOT=Path(__file__).resolve().parents[1]
BASE="https://shelternewlife.github.io/DevImpact"
LANGS=("en","fr","ar","de","it","es","pt")
class Head(HTMLParser):
 def __init__(self): super().__init__(); self.canonical=""; self.noindex=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=="link" and a.get("rel")=="canonical": self.canonical=a.get("href","")
  if tag=="meta" and a.get("name","").lower()=="robots": self.noindex="noindex" in a.get("content","").lower()
def main():
 pages={}
 for f in ROOT.rglob("*.html"):
  rel=f.relative_to(ROOT).as_posix()
  if rel=="404.html" or rel.endswith("/404.html"): continue
  h=Head(); h.feed(f.read_text(encoding="utf-8"))
  if h.noindex: continue
  path="" if rel=="index.html" else rel[:-10] if rel.endswith("/index.html") else rel
  parts=path.split("/",1); lang,suffix=(parts[0],parts[1]) if len(parts)==2 and parts[0] in LANGS[1:] else ("en",path)
  pages[(lang,suffix)]=h.canonical or BASE+"/"+path
 register_namespace("","http://www.sitemaps.org/schemas/sitemap/0.9"); register_namespace("xhtml","http://www.w3.org/1999/xhtml")
 n="{http://www.sitemaps.org/schemas/sitemap/0.9}"; x="{http://www.w3.org/1999/xhtml}"
 root=Element(n+"urlset")
 for (lang,suffix),url in sorted(pages.items(),key=lambda z:z[1]):
  node=SubElement(root,n+"url"); SubElement(node,n+"loc").text=url; SubElement(node,n+"lastmod").text=date.today().isoformat()
  for l in LANGS:
   target=pages.get((l,suffix))
   if target: SubElement(node,x+"link",{"rel":"alternate","hreflang":l,"href":target})
  SubElement(node,x+"link",{"rel":"alternate","hreflang":"x-default","href":pages.get(("en",suffix),url)})
 ElementTree(root).write(ROOT/"sitemap.xml",encoding="utf-8",xml_declaration=True)
 print(f"Generated sitemap.xml with {len(pages)} indexable URLs")
if __name__=="__main__": main()
