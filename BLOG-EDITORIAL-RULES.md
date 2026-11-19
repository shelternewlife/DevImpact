# DevImpact Blog — Mandatory Editorial and SEO Rules

**Status: mandatory, permanent project policy.** These rules apply to every current and future blog article, in every language. They are not optional style suggestions. A new article must not be published until it complies. When new rules are approved, add them to this file and, wherever practical, encode them in `scripts/quality_checks.py` so GitHub Actions can reject violations.

## Rule 1 — Every language has its own SEO strategy and keyword research

SEO must be planned independently for each language and target market. Never take the English SEO plan and translate it word for word into Arabic, French, German, Spanish, Italian or Portuguese. Never assume that the same search phrase, search intent, wording, popularity or competition exists across languages.

For every language version of an article:

1. Research the actual search terms used by people in that language and target market. Consider regional usage (for example, French for France is not automatically the same as French for Canada, and European Portuguese is not Brazilian Portuguese).
2. Select a **language-specific primary focus keyword** based on local search intent, relevance, and realistic competition. Choose secondary and semantic terms from the same language and market.
3. Write an original, natural SEO title, meta description, H1, headings, introduction, examples and body for that audience. Translation may be used as a starting reference only; it is never a substitute for local keyword research or editorial adaptation.
4. Match the article's content to the local search intent. Do not force a keyword into text where it sounds unnatural, and do not create duplicate or near-duplicate pages solely to target keyword variations.
5. Keep official app names, product names and trademarks accurate. Translate surrounding explanations naturally.
6. Do not copy the same primary keyword from another language version. Equivalent topics may be covered, but each locale must target its own researched query and phrasing.
7. Record the locale and primary keyword in the article HTML using:
   - `<meta name="devimpact:seo-language" content="LOCALE">`
   - `<meta name="devimpact:focus-keyword" content="locally researched phrase">`
   The locale must match the article's language path (`blog/` = `en`; `ar/blog/` = `ar`; and similarly `fr`, `de`, `es`, `it`, `pt`). These fields are machine-readable editorial declarations, not a replacement for genuine research.

## Publication gate

- The blog index page (`blog/index.html` and each localized `<language>/blog/index.html`) is a landing page, not an article. It must be preserved when articles are added, edited or removed.
- Every article must have its own localized title, meta description, H1 and primary focus keyword.
- The primary focus keyword must be researched for that locale; do not simply translate another locale's keyword.
- The GitHub Actions quality check validates the declared SEO language and prevents identical primary focus keywords being reused across language versions of the same article.
- A passing automated check does not prove keyword research quality, search demand, ranking potential, or editorial usefulness. A human must verify these before publication.

## Adding future rules

Append each newly approved mandatory rule to this document with a numbered heading. Update the automated quality checks when the rule can be objectively tested. Treat this file as the single source of truth for blog editorial requirements; do not rely on remembering instructions from an earlier chat.


## Rule 2 — Candidate keyword registry

The file data/seo-keywords.json is an optional idea-starter registry, not a validated keyword database, publication whitelist, or source of search-volume claims. The ten phrases currently listed per group and language are unverified candidates and may be linguistically unnatural. Authors must research the actual target market and may select better queries that are not in the registry. Do not impose a fixed keyword count, maximum phrase length, keyword density or article word count. Never claim volume or competition without dated evidence.

## Rule 3 — Mandatory article SEO brief and publication gate

Follow SEO-STRATEGY.md for every article and language version. Required declarations: devimpact:seo-language, devimpact:seo-market, devimpact:search-intent, devimpact:content-type, devimpact:keyword-group and devimpact:focus-keyword. Secondary terms are optional and research-led. Each locale needs independent market research and original editorial adaptation. Automated checks do not guarantee rankings; human research and editorial review are mandatory.
