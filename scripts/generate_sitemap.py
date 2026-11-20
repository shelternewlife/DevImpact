#!/usr/bin/env python3
"""Regenerate a clean, Google-friendly sitemap.xml from indexable static HTML pages.

Improvements over the previous version:
- Only includes pages that actually exist on disk
- Uses file modification time for <lastmod>
- Adds hreflang alternates only when the target language version exists
- Skips noindex pages and 404 pages
- Validates / normalizes canonical URLs
- Produces well-formed XML and prints a clear summary + warnings
"""

from __future__ import annotations

from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from xml.etree.ElementTree import Element, ElementTree, SubElement, register_namespace
import sys

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://shelternewlife.github.io/DevImpact"
LANGS = ("en", "fr", "ar", "de", "it", "es", "pt")
NON_EN_LANGS = set(LANGS[1:])

SM_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
XHTML_NS = "http://www.w3.org/1999/xhtml"


class HeadParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.canonical = ""
        self.noindex = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = {k: (v or "") for k, v in attrs}
        if tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href", "").strip()
        if tag == "meta" and a.get("name", "").lower() == "robots":
            content = a.get("content", "").lower()
            if "noindex" in content:
                self.noindex = True


def path_from_rel(rel: str) -> str:
    """Convert an index file path to its canonical directory URL path."""
    if rel == "index.html":
        return ""
    if rel.endswith("/index.html"):
        return rel[: -len("/index.html")]
    if rel.endswith(".html"):
        return rel[:-5]
    return rel


def lang_and_suffix(path: str) -> tuple[str, str]:
    """Split URL path into (language, suffix). English has no language prefix."""
    if not path:
        return "en", ""
    parts = path.split("/", 1)
    if parts[0] in NON_EN_LANGS:
        return parts[0], parts[1] if len(parts) > 1 else ""
    return "en", path


def expected_url(path: str) -> str:
    """GitHub Pages directory index pages use canonical URLs ending in a slash."""
    return f"{BASE}/{path}/" if path else f"{BASE}/"


def file_lastmod(file_path: Path) -> str:
    """ISO date (YYYY-MM-DD) from file mtime in UTC."""
    ts = file_path.stat().st_mtime
    return datetime.fromtimestamp(ts, tz=timezone.utc).date().isoformat()


def collect_pages() -> tuple[dict[tuple[str, str], dict], list[str]]:
    """
    Returns:
      pages: {(lang, suffix): {"url": ..., "lastmod": ..., "file": ...}}
      warnings: list of human-readable warnings
    """
    pages: dict[tuple[str, str], dict] = {}
    warnings: list[str] = []

    for f in sorted(ROOT.rglob("*.html")):
        rel = f.relative_to(ROOT).as_posix()

        # Skip error pages
        if rel == "404.html" or rel.endswith("/404.html"):
            continue

        try:
            html = f.read_text(encoding="utf-8")
        except Exception as e:
            warnings.append(f"Could not read {rel}: {e}")
            continue

        parser = HeadParser()
        try:
            parser.feed(html)
        except Exception as e:
            warnings.append(f"HTML parse error in {rel}: {e}")
            continue

        if parser.noindex:
            continue

        path = path_from_rel(rel)
        lang, suffix = lang_and_suffix(path)
        url = expected_url(path)

        # Prefer a matching canonical if present; otherwise fall back to constructed URL
        canonical = parser.canonical.rstrip("/")
        expected = url.rstrip("/")
        if canonical and canonical != expected:
            # Allow English canonical on non-English pages only if it points to the English equivalent
            # (some sites do this intentionally). Still record a warning.
            warnings.append(
                f"Canonical mismatch for {rel}: "
                f"got {parser.canonical!r}, expected {url!r} (using constructed URL)"
            )
            # Keep constructed URL so sitemap never points to a non-existent location

        key = (lang, suffix)
        if key in pages:
            warnings.append(f"Duplicate key {key} from {rel} (previous: {pages[key]['file']})")
            continue

        pages[key] = {
            "url": url,
            "lastmod": file_lastmod(f),
            "file": rel,
            "path": path,
        }

    return pages, warnings


def build_sitemap(pages: dict[tuple[str, str], dict]) -> Element:
    register_namespace("", SM_NS)
    register_namespace("xhtml", XHTML_NS)

    root = Element(f"{{{SM_NS}}}urlset")

    # Stable order by final URL
    for (lang, suffix), info in sorted(pages.items(), key=lambda item: item[1]["url"]):
        node = SubElement(root, f"{{{SM_NS}}}url")
        SubElement(node, f"{{{SM_NS}}}loc").text = info["url"]
        SubElement(node, f"{{{SM_NS}}}lastmod").text = info["lastmod"]

        # hreflang alternates – only for languages that actually exist
        for l in LANGS:
            target = pages.get((l, suffix))
            if target:
                SubElement(
                    node,
                    f"{{{XHTML_NS}}}link",
                    {
                        "rel": "alternate",
                        "hreflang": l,
                        "href": target["url"],
                    },
                )

        # x-default prefers English version when available
        default = pages.get(("en", suffix), info)
        SubElement(
            node,
            f"{{{XHTML_NS}}}link",
            {
                "rel": "alternate",
                "hreflang": "x-default",
                "href": default["url"],
            },
        )

    return root


def write_sitemap(root: Element, dest: Path) -> None:
    # Ensure clean declaration and UTF-8
    tree = ElementTree(root)
    tree.write(
        dest,
        encoding="utf-8",
        xml_declaration=True,
        default_namespace=None,
        method="xml",
    )


def main() -> int:
    pages, warnings = collect_pages()

    if not pages:
        print("ERROR: No indexable pages found.", file=sys.stderr)
        return 1

    root = build_sitemap(pages)
    out = ROOT / "sitemap.xml"
    write_sitemap(root, out)

    # Summary
    print(f"Generated {out.relative_to(ROOT)} with {len(pages)} indexable URLs")

    # Language coverage stats
    by_lang: dict[str, int] = {}
    for lang, _ in pages:
        by_lang[lang] = by_lang.get(lang, 0) + 1
    print("Per language:", ", ".join(f"{k}={v}" for k, v in sorted(by_lang.items())))

    if warnings:
        print(f"\n{len(warnings)} warning(s):")
        for w in warnings[:30]:
            print(f"  - {w}")
        if len(warnings) > 30:
            print(f"  ... and {len(warnings) - 30} more")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
