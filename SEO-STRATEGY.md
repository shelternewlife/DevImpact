# DevImpact — Multilingual SEO Operating Standard

Status: mandatory publication standard for all supported languages and future articles. This system improves the quality and consistency of SEO work; it cannot guarantee indexing, traffic, or first-place rankings.

## 1. Research before drafting
For every page, record the target audience, one primary country/market, the reader problem, and one dominant search intent. Classify intent as informational, commercial investigation, navigational, or transactional. Review current Google results for the exact query in the target country and language. Record the date, query variants, result formats, competitor strengths and content gaps, and the distinct value DevImpact can provide. Use Search Console data when available; use Keyword Planner, Trends and autocomplete as supporting evidence. Record sources and dates. Never invent volume, difficulty, traffic forecasts or rankings.

Choose one primary query and a relevant cluster of secondary queries, synonyms, entities and questions. There is no fixed keyword count, two-word limit, density target or mandatory article length. Prefer a specific long-tail phrase when it better matches real intent. Map one primary intent to one best page and avoid keyword cannibalization or near-duplicate pages.

## 2. Language and country localization
Supported paths: en, ar, fr, de, es, it and pt. Language is not the same as market:
- en: choose US or Canada per article; localize spelling, examples, terminology and currency.
- fr: choose France or French-speaking Canada; do not blend France and Quebec phrasing without research.
- de: Germany by default unless another German-speaking market is researched.
- es: Spain by default unless another market is researched.
- it: Italy by default.
- pt: Portugal by default, not Brazilian Portuguese.
- ar: record a specific Arabic-speaking country whenever evidence allows; use clear Arabic and localize examples and vocabulary where appropriate.

Every article declares its language and primary market. If materially different country-specific content is needed, create a separate URL only when it offers genuinely useful localized information, not a thin doorway page. Keep canonical and hreflang relationships accurate.

## 3. Required article research declarations
Every article must declare these HTML meta fields:
- devimpact:seo-language — en/ar/fr/de/es/it/pt, matching the URL path.
- devimpact:seo-market — target country/market (for example US, CA, FR, CA-fr, DE, ES, IT, PT, TN-ar).
- devimpact:search-intent — informational, commercial, navigational or transactional.
- devimpact:content-type — article, guide, comparison, tutorial or review.
- devimpact:keyword-group — site or the exact app ID in data/apps.json.
- devimpact:focus-keyword — researched primary query in the article language.
- devimpact:secondary-keywords — optional comma-separated related queries, only when researched.

The ten entries in data/seo-keywords.json are idea starters only, not approved keywords or a publication whitelist. They are not volume-verified and must not constrain article wording. Authors may use better researched queries absent from that file. Never fabricate a list merely to meet a quota.

## 4. Content quality
Write for the reader, not for a keyword counter. Each language version needs independent research and original adaptation: title, description, H1, introduction, headings, examples, FAQs and calls to action. Translation alone is not localization.
Answer the main query clearly near the beginning, then satisfy the full intent with useful detail, steps, examples, limitations and original analysis. When discussing a DevImpact app, verify every feature, screenshot, package ID and Play Store link against the real app and official listing. Never invent capabilities, awards, ratings, prices or outcomes.
Use one clear H1 and descriptive H2/H3 headings. No fixed word count, keyword density, repetition quota, hidden text, doorway pages or mass-produced near-duplicates. Use the focus query naturally where relevant; related concepts should appear only when useful.
Add contextual internal links and trustworthy external citations for factual claims. Use meaningful localized image alt text; empty alt is acceptable only for decorative images. Use responsive, compressed images with intrinsic dimensions. Make authorship, review responsibility and source transparency visible; never fabricate credentials or testimonials. Update content when facts or products materially change, not by changing dates without substantive review.

## 5. Technical SEO
Every indexable page needs a unique descriptive title and meta description, correct lang and dir, one H1, self-referencing canonical, accurate reciprocal hreflang for real equivalent pages, crawlable links, and correct indexability. Do not canonicalize a distinct localized page to English just because the topic is shared.
Use accurate Open Graph and Twitter metadata and absolute image URLs. Keep XML sitemap entries limited to canonical indexable pages. Structured data must truthfully describe visible content. Articles should use valid Article or BlogPosting JSON-LD with headline, image, datePublished, dateModified, author and publisher. Never fabricate reviews, ratings or FAQ content. Structured data does not guarantee rich results.
Keep primary content and navigation accessible without unnecessary JavaScript dependence. Review mobile usability, HTTPS, responsive images, accessibility and Core Web Vitals as part of overall page experience, not as isolated ranking guarantees.

## 6. Publication and measurement
1. Save the research brief: query, intent, market, competitors, content gap, source and research date.
2. Check existing pages for overlap and choose the correct keyword group.
3. Draft natively in the target language; review language quality and factual accuracy.
4. Complete all required metadata and technical markup.
5. Run python scripts/quality_checks.py and resolve errors; review warnings manually.
6. Preview mobile and desktop, check links, images and the official Play Store destination.
7. Publish and inspect the canonical URL in Search Console.
8. Monitor indexing, impressions, clicks, CTR, average position, query mix and country. Improve pages based on real evidence.

## 7. Automation limits
GitHub Actions can validate metadata, path/locale consistency, canonical and hreflang targets, JSON-LD syntax and required Article fields, headings, image alt attributes, local links and sitemap integrity. It cannot prove search demand, native-language quality, originality, helpfulness, competitor difficulty or future rankings. Human research and editorial review remain mandatory.
