# DevImpact site data and quality checks

## Central application catalogue

`data/apps.json` is the canonical catalogue for the ten published Android apps. It stores each app's display name, package ID, category, short description and English/Arabic detail-page paths. Update this file when the official Google Play listing changes, then keep the static page copy aligned with it.

## Run validation

Requires Python 3.10+ and the standard library only:

```bash
python scripts/quality_checks.py
python scripts/quality_checks.py --external
```

The checks cover catalogue completeness and uniqueness, Android package IDs on both localized detail pages, HTML titles/descriptions, canonical URLs, hreflang targets, local links/assets, sitemap XML validity, duplicate URLs, page coverage and sitemap alternates. The external mode checks unique HTTP destinations; 403/429 restrictions are reported as unverifiable rather than falsely treated as broken.

GitHub Actions runs the checks on pushes to `main`, pull requests targeting `main`, and manual dispatch. The workflow is read-only and does not deploy or require paid services.

## Image and social metadata policy

Use WebP or AVIF for photographic and screenshot assets, include intrinsic `width` and `height`, and use responsive `srcset`/`sizes` where multiple resolutions exist. Keep vector brand marks as SVG. Each indexable page should declare an absolute `og:image` URL and a Twitter large-image card. The quality check reports missing social image metadata so page-specific previews can be added without inventing artwork.

## Mandatory blog editorial policy

`BLOG-EDITORIAL-RULES.md` is the permanent, authoritative policy for all current and future blog articles. Rule 1 requires independent SEO research and a distinct primary focus keyword for every language and target market; literal translation of another locale's keyword strategy is prohibited. Each article must declare `devimpact:seo-language` and `devimpact:focus-keyword` metadata. `scripts/quality_checks.py` enforces the declared locale and rejects identical focus keywords across language versions of the same article. The localized blog index pages are landing pages and must never be treated as article pages or deleted when managing articles.


## Permanent multilingual keyword register

`data/seo-keywords.json` is the source of truth: ten strategic candidate phrases for the general site and ten per app, per supported language. Each phrase is at most two words. Every article must declare `devimpact:keyword-group` (`site` or an app ID) and a `devimpact:focus-keyword` from that exact locale/group list. Add ten phrases per language when adding an app. Current entries are candidates, not measured search-volume data.


## Full multilingual SEO operating standard

SEO-STRATEGY.md is the mandatory standard for keyword research, country-level localization, article briefs, people-first content, technical SEO, structured data, publishing and Search Console measurement. The keyword registry contains idea starters only; it is not a whitelist or verified volume source. No fixed keyword count, density or article word count is required.
