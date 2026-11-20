#!/usr/bin/env python3
"""Verify sitemap.xml before (or after) deploy.

Usage:
  # فحص محلي (قبل git push) — يجب أن يمر دائماً
  python scripts/verify_sitemap.py

  # فحص حي على GitHub Pages (بعد ما ينتشر الموقع)
  python scripts/verify_sitemap.py --live
"""

from __future__ import annotations

import argparse
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
BASE = "https://shelternewlife.github.io/DevImpact"
SM_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def load_urls() -> list[str]:
    if not SITEMAP.is_file():
        print(f"ERROR: {SITEMAP} not found. Run generate_sitemap.py first.", file=sys.stderr)
        sys.exit(2)
    root = ET.parse(SITEMAP).getroot()
    urls = [n.text.strip() for n in root.findall("sm:url/sm:loc", SM_NS) if n.text]
    if not urls:
        print("ERROR: sitemap has no <loc> entries.", file=sys.stderr)
        sys.exit(2)
    return urls


def url_to_local(url: str) -> Path | None:
    """Map a sitemap URL back to the expected local HTML file."""
    p = urlparse(url)
    if p.netloc != "shelternewlife.github.io":
        return None
    path = p.path
    if not path.startswith("/DevImpact"):
        return None
    rel = path[len("/DevImpact") :].lstrip("/")  # e.g. "about/" or "ar/blog/foo/"
    if not rel or rel.endswith("/"):
        candidate = ROOT / rel / "index.html"
    else:
        candidate = ROOT / f"{rel}.html"
        if not candidate.is_file():
            candidate = ROOT / rel / "index.html"
    return candidate


def check_local(urls: list[str]) -> int:
    missing = []
    outside = []
    for u in urls:
        local = url_to_local(u)
        if local is None:
            outside.append(u)
            continue
        if not local.is_file():
            missing.append((u, str(local.relative_to(ROOT))))

    print(f"Local check: {len(urls)} URLs in sitemap")
    if outside:
        print(f"  {len(outside)} URL(s) outside expected host/path:")
        for u in outside[:10]:
            print(f"    - {u}")
    if missing:
        print(f"  FAIL: {len(missing)} URL(s) have no local HTML file:")
        for u, path in missing[:40]:
            print(f"    - {u}")
            print(f"      expected file: {path}")
        if len(missing) > 40:
            print(f"    ... and {len(missing) - 40} more")
        return 1

    print("  OK: every sitemap URL maps to an existing local HTML file")
    return 0


def head_status(url: str) -> tuple[str, int | str]:
    req = urllib.request.Request(
        url,
        method="HEAD",
        headers={"User-Agent": "DevImpact-Sitemap-Verify/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as r:
            return url, r.status
    except urllib.error.HTTPError as e:
        return url, e.code
    except Exception as e:
        return url, f"{type(e).__name__}: {e}"


def check_live(urls: list[str], workers: int = 12) -> int:
    print(f"Live check: requesting {len(urls)} URLs (HEAD)…")
    bad: list[tuple[str, int | str]] = []
    done = 0
    with ThreadPoolExecutor(max_workers=workers) as ex:
        futs = [ex.submit(head_status, u) for u in urls]
        for fut in as_completed(futs):
            u, status = fut.result()
            done += 1
            if status != 200:
                bad.append((u, status))
            if done % 50 == 0 or done == len(urls):
                print(f"  … {done}/{len(urls)}")

    if bad:
        print(f"  FAIL: {len(bad)} URL(s) did not return 200:")
        for u, status in sorted(bad, key=lambda x: str(x[1])):
            print(f"    [{status}] {u}")
        return 1

    print("  OK: all sitemap URLs returned HTTP 200")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="Verify sitemap.xml before/after deploy")
    ap.add_argument(
        "--live",
        action="store_true",
        help="Also (or only) check live HTTP status on GitHub Pages",
    )
    ap.add_argument(
        "--live-only",
        action="store_true",
        help="Skip local file check; only run live HTTP checks",
    )
    args = ap.parse_args()

    urls = load_urls()
    rc = 0

    if not args.live_only:
        rc = check_local(urls) or rc

    if args.live or args.live_only:
        # small pause so GitHub Pages can catch up if you just pushed
        if args.live:
            time.sleep(1)
        rc = check_live(urls) or rc

    if rc == 0:
        print("\nSitemap verification passed.")
    else:
        print("\nSitemap verification FAILED. Do not push until fixed.", file=sys.stderr)
    return rc


if __name__ == "__main__":
    raise SystemExit(main())
