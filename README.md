# CoverFormula

Free, independent insurance calculators — no signup, no lead-gen forms, every calculation runs client-side in your browser.

Live at [coverformula.com](https://coverformula.com)

## Calculators

- Life Insurance (DIME method)
- Life Insurance Simulator (premium by age / term / health class)
- Annuity Simulator (immediate & deferred income)
- Disability Insurance
- Umbrella Insurance
- COBRA Cost
- Title Insurance
- PMI Removal
- Mortgage Refinance Break-Even
- HSA Savings
- Auto Insurance Premium Estimator
- Social Security Estimate

## Free Companion Tools

- [Life Insurance Coverage Calculator](https://sadiyaqeen92639572-cloud.github.io/life-insurance-coverage-calculator/) — quick DIME-method estimate. Powered by [CoverFormula](https://coverformula.com/life-insurance-calculator/).

## Stack

Static HTML/CSS/vanilla JS, deployed to Cloudflare Pages.

Hand-maintained since the Phase 5 calculators. To add a page: copy an existing
page dir as a template, then update `index.html` (hub-grid, footer, ItemList
JSON-LD, badge count) and `sitemap.xml`. The old `generate-pages.js.deprecated`
is kept for reference only — it is out of sync and must not be run (it would
overwrite the index and wipe every page added since Phase 5).
