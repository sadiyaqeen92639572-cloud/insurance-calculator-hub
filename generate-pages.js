const fs = require('fs');
const path = require('path');

const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'site.config.json'), 'utf8'));

const orgJsonLd = (pageName) => ({
  "@type": "Organization",
  "name": cfg.siteName,
  "url": cfg.baseUrl,
  "legalName": cfg.legalName,
  "identifier": { "@type": "PropertyValue", "propertyID": "UK Company Number", "value": cfg.companyNumber },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Hardy House, 269 Poynders Gardens",
    "addressLocality": "London",
    "postalCode": "SW4 8PQ",
    "addressCountry": "GB"
  }
});

function layout({ slug, title, metaDescription, h1, badge, calcHtml, calcScript, content, faq, breadcrumbName, sources, formula }) {
  const url = slug ? `${cfg.baseUrl}/${slug}/` : `${cfg.baseUrl}/`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": breadcrumbName || h1,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "url": url,
        "description": metaDescription,
        "dateModified": cfg.lastReviewed,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "author": orgJsonLd(title),
        "publisher": orgJsonLd(title)
      },
      slug ? {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": cfg.baseUrl + "/" },
          { "@type": "ListItem", "position": 2, "name": breadcrumbName, "item": url }
        ]
      } : null,
      faq && faq.length ? {
        "@type": "FAQPage",
        "mainEntity": faq.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      } : null
    ].filter(Boolean)
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${metaDescription}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${metaDescription}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:image" content="${cfg.baseUrl}/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${metaDescription}">
<meta name="twitter:image" content="${cfg.baseUrl}/assets/og-image.png">
<link rel="stylesheet" href="${slug ? '../' : ''}assets/style.css">
<link rel="icon" href="${slug ? '../' : ''}assets/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="${slug ? '../' : ''}assets/apple-touch-icon.png">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<header class="site">
  <div class="wrap">
    <a href="${slug ? '../' : './'}" class="brand"><span class="dot">🛡</span> Insurance Calculator Hub</a>
    <nav class="top">
      <a href="${slug ? '../' : './'}#calculators">Calculators</a>
      <a href="${slug ? '../' : './'}about/">About</a>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    ${badge ? `<span class="badge">${badge}</span><br>` : ''}
    <h1>${h1}</h1>
    <p class="lead">${metaDescription}</p>
  </div>
</section>

<div class="wrap">
  <div class="calc-card">
    ${calcHtml}
  </div>
</div>

<div class="wrap content">
${slug ? `<p style="font-size:.78rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.04em;">Written &amp; fact-checked by the Insurance Calculator Hub editorial team · Last reviewed ${cfg.lastReviewed}</p>` : ''}
${content}
${formula ? `<div class="formula-box"><div class="label">Formula</div><code>${formula}</code></div>` : ''}
${faq && faq.length ? `<h2>Frequently Asked Questions</h2>${faq.map(f => `<div class="faq-item"><h3>${f.q}</h3><p>${f.a}</p></div>`).join('')}` : ''}
${sources && sources.length ? `<h2>Sources</h2><ul>${sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer nofollow">${s.name}</a></li>`).join('')}</ul>` : ''}
</div>

<footer class="site">
  <div class="wrap">
    <div class="cols">
      <div>
        <h4>Insurance Calculator Hub</h4>
        <p style="font-size:.82rem;max-width:360px;color:#94a3b8;">Free, independent insurance and mortgage-insurance calculators. Estimates only — always confirm figures with a licensed agent or your policy documents before making a decision.</p>
      </div>
      <div>
        <h4>Calculators</h4>
        <a href="${slug ? '../' : './'}life-insurance-calculator/">Life Insurance</a>
        <a href="${slug ? '../' : './'}disability-insurance-calculator/">Disability Insurance</a>
        <a href="${slug ? '../' : './'}umbrella-insurance-calculator/">Umbrella Insurance</a>
        <a href="${slug ? '../' : './'}cobra-insurance-calculator/">COBRA Cost</a>
        <a href="${slug ? '../' : './'}title-insurance-calculator/">Title Insurance</a>
        <a href="${slug ? '../' : './'}pmi-removal-calculator/">PMI Removal</a>
      </div>
      <div>
        <h4>Site</h4>
        <a href="${slug ? '../' : './'}about/">About &amp; Methodology</a>
      </div>
    </div>
    <div class="legal">
      <p>© ${new Date().getFullYear()} Insurance Calculator Hub. All calculators are for educational estimation purposes only and do not constitute insurance, financial, tax, or legal advice.</p>
      <p>Insurance Calculator Hub is part of ${cfg.legalName}, registered UK company number ${cfg.companyNumber}, registered office address at ${cfg.registeredOffice}.</p>
    </div>
  </div>
</footer>
${calcScript}
</body>
</html>`;
}

// ---------- Calculator page definitions ----------

const pages = [];

// 1. Life Insurance Calculator (DIME method)
pages.push({
  slug: 'life-insurance-calculator',
  breadcrumbName: 'Life Insurance Calculator',
  title: 'Life Insurance Calculator — How Much Coverage Do You Need? | Insurance Calculator Hub',
  metaDescription: 'Free life insurance needs calculator using the DIME method (Debt, Income, Mortgage, Education). Estimate the right coverage amount in seconds.',
  h1: 'Life Insurance Calculator',
  badge: 'DIME Method',
  calcHtml: `
    <h2 style="margin-top:0;font-size:1.2rem;">Estimate Your Coverage Need</h2>
    <div class="calc-grid">
      <div class="field"><label>Annual Income ($)</label><input type="number" id="li-income" value="70000"></div>
      <div class="field"><label>Years of Income to Replace</label><input type="number" id="li-years" value="10"><div class="hint">Typically 10-20 years, or until kids are independent.</div></div>
      <div class="field"><label>Other Debts (excl. mortgage) ($)</label><input type="number" id="li-debt" value="15000"></div>
      <div class="field"><label>Remaining Mortgage Balance ($)</label><input type="number" id="li-mortgage" value="220000"></div>
      <div class="field"><label>Future Education Costs ($)</label><input type="number" id="li-education" value="60000"></div>
      <div class="field"><label>Existing Life Insurance / Liquid Savings ($)</label><input type="number" id="li-existing" value="10000"></div>
    </div>
    <button class="calc-btn" onclick="calcLife()">Calculate Coverage Need</button>
    <div class="result-box" id="li-result" style="display:none;">
      <div class="result-row hero-result"><span class="k">Recommended Coverage</span><span class="v" id="li-total"></span></div>
      <div class="result-row"><span class="k">Income Replacement (D I part)</span><span class="v" id="li-income-out"></span></div>
      <div class="result-row"><span class="k">Debt + Mortgage</span><span class="v" id="li-debtmort-out"></span></div>
      <div class="result-row"><span class="k">Education Fund</span><span class="v" id="li-edu-out"></span></div>
      <div class="result-row"><span class="k">Less Existing Coverage</span><span class="v" id="li-existing-out"></span></div>
    </div>
  `,
  calcScript: `<script>
function calcLife(){
  const income=+document.getElementById('li-income').value||0;
  const years=+document.getElementById('li-years').value||0;
  const debt=+document.getElementById('li-debt').value||0;
  const mortgage=+document.getElementById('li-mortgage').value||0;
  const education=+document.getElementById('li-education').value||0;
  const existing=+document.getElementById('li-existing').value||0;
  const incomeReplacement=income*years;
  const debtMortgage=debt+mortgage;
  const gross=incomeReplacement+debtMortgage+education;
  const net=Math.max(0,gross-existing);
  const fmt=n=>'$'+Math.round(n).toLocaleString();
  document.getElementById('li-total').textContent=fmt(net);
  document.getElementById('li-income-out').textContent=fmt(incomeReplacement);
  document.getElementById('li-debtmort-out').textContent=fmt(debtMortgage);
  document.getElementById('li-edu-out').textContent=fmt(education);
  document.getElementById('li-existing-out').textContent='-'+fmt(existing);
  document.getElementById('li-result').style.display='block';
}
</script>`,
  content: `
    <h2>What Is the DIME Method?</h2>
    <p>DIME stands for <strong>Debt, Income, Mortgage, Education</strong> — a widely used rule-of-thumb formula for estimating how much life insurance coverage a family actually needs, rather than relying on generic multiples of salary (like "10x income"). It adds up every major financial obligation your family would face if your income stopped tomorrow, then subtracts assets already available to cover them.</p>
    <h2>How the Calculation Works</h2>
    <ul>
      <li><strong>D — Debt:</strong> credit cards, car loans, personal loans, and any other non-mortgage debt.</li>
      <li><strong>I — Income:</strong> your annual income multiplied by the number of years your family would need support (commonly until the youngest child turns 18 or finishes college).</li>
      <li><strong>M — Mortgage:</strong> the remaining balance owed on your home.</li>
      <li><strong>E — Education:</strong> estimated future cost of college or vocational training for your children.</li>
    </ul>
    <p>The tool subtracts any existing life insurance and liquid savings from the total, giving you the net additional coverage to shop for.</p>
    <div class="disclaimer">This calculator provides an educational estimate only. Insurance needs vary by family, health status, and state. Speak with a licensed life insurance agent or financial advisor before purchasing a policy.</div>
  `,
  formula: 'Coverage Needed = (Annual Income × Years to Replace) + Other Debt + Mortgage Balance + Education Costs − Existing Coverage',
  faq: [
    { q: 'How much life insurance do I actually need?', a: 'It depends on your income, debts, dependents, and financial goals. The DIME method (Debt + Income replacement + Mortgage + Education) gives a more accurate estimate than flat multiples of salary because it accounts for your actual obligations.' },
    { q: 'Term or whole life insurance?', a: 'Term life insurance is generally cheaper and matches temporary needs (like a mortgage or raising kids), while whole life is permanent and includes a cash-value component at a higher premium. Most people shopping for pure income replacement choose term.' },
    { q: 'Does employer-provided life insurance count as existing coverage?', a: 'Yes — include any group life insurance through your employer in the "existing coverage" field, but remember it typically ends if you leave your job, so many people supplement it with an individual policy.' }
  ],
  sources: [
    { name: 'NAIC — Life Insurance Buyer\'s Guide', url: 'https://content.naic.org/consumer/life-insurance.htm' },
    { name: 'Consumer Financial Protection Bureau — Life Insurance', url: 'https://www.consumerfinance.gov/' }
  ]
});

// 2. Disability Insurance Calculator
pages.push({
  slug: 'disability-insurance-calculator',
  breadcrumbName: 'Disability Insurance Calculator',
  title: 'Disability Insurance Calculator — Estimate Your Coverage Gap | Insurance Calculator Hub',
  metaDescription: 'Calculate how much disability insurance coverage you need based on your income, existing employer benefits, and target income replacement percentage.',
  h1: 'Disability Insurance Calculator',
  badge: 'Income Protection',
  calcHtml: `
    <h2 style="margin-top:0;font-size:1.2rem;">Estimate Your Coverage Gap</h2>
    <div class="calc-grid">
      <div class="field"><label>Gross Monthly Income ($)</label><input type="number" id="di-income" value="6000"></div>
      <div class="field"><label>Target Income Replacement (%)</label><input type="number" id="di-target" value="65"><div class="hint">Most insurers cap individual policies at 60-70% of income.</div></div>
      <div class="field"><label>Existing Employer/Group Monthly Benefit ($)</label><input type="number" id="di-existing" value="1500"></div>
      <div class="field"><label>Elimination Period (days before benefits start)</label><input type="number" id="di-elim" value="90"></div>
    </div>
    <button class="calc-btn" onclick="calcDisability()">Calculate Coverage Gap</button>
    <div class="result-box" id="di-result" style="display:none;">
      <div class="result-row hero-result"><span class="k">Additional Monthly Benefit Needed</span><span class="v" id="di-gap"></span></div>
      <div class="result-row"><span class="k">Target Monthly Benefit</span><span class="v" id="di-target-out"></span></div>
      <div class="result-row"><span class="k">Savings Needed to Cover Elimination Period</span><span class="v" id="di-elim-out"></span></div>
    </div>
  `,
  calcScript: `<script>
function calcDisability(){
  const income=+document.getElementById('di-income').value||0;
  const target=+document.getElementById('di-target').value||0;
  const existing=+document.getElementById('di-existing').value||0;
  const elim=+document.getElementById('di-elim').value||0;
  const targetBenefit=income*(target/100);
  const gap=Math.max(0,targetBenefit-existing);
  const elimSavings=(income/30)*elim;
  const fmt=n=>'$'+Math.round(n).toLocaleString();
  document.getElementById('di-gap').textContent=fmt(gap)+'/mo';
  document.getElementById('di-target-out').textContent=fmt(targetBenefit)+'/mo';
  document.getElementById('di-elim-out').textContent=fmt(elimSavings);
  document.getElementById('di-result').style.display='block';
}
</script>`,
  content: `
    <h2>Why Disability Insurance Matters</h2>
    <p>A serious illness or injury is statistically far more likely to interrupt your income before retirement than death is — yet most workers carry life insurance and skip disability coverage entirely. Disability insurance replaces a portion of your income if you become unable to work.</p>
    <h2>How This Calculator Works</h2>
    <p>Insurers typically cap individual disability policies at 60-70% of gross income (to preserve the incentive to return to work). This tool multiplies your gross monthly income by your target replacement percentage, then subtracts any group/employer coverage you already have to show the remaining gap an individual policy should fill. It also estimates the savings you'd need on hand to bridge the "elimination period" — the waiting window before benefit payments begin.</p>
    <div class="disclaimer">Estimate only. Actual underwriting, benefit caps, and elimination periods vary by insurer, occupation class, and state. Consult a licensed disability insurance broker for an accurate quote.</div>
  `,
  formula: 'Coverage Gap = (Gross Monthly Income × Target Replacement %) − Existing Group/Employer Benefit',
  faq: [
    { q: 'What percentage of income does disability insurance replace?', a: 'Most individual and group long-term disability policies replace 60-70% of gross income, since benefits are often received tax-free (for individually-paid premiums) and insurers want to preserve a financial incentive to return to work.' },
    { q: 'What is an elimination period?', a: 'The elimination period is the waiting time (commonly 30, 60, or 90 days) between the start of a disability and when benefit payments begin. A longer elimination period generally lowers your premium but requires more emergency savings to bridge the gap.' },
    { q: 'Does my employer\'s group disability policy cover enough?', a: 'Often not fully — many group policies replace only 50-60% of base salary and may exclude bonuses or commissions, plus benefits are usually taxable if your employer paid the premiums. An individual supplemental policy can close that gap.' }
  ],
  sources: [
    { name: 'Social Security Administration — Disability Benefits', url: 'https://www.ssa.gov/benefits/disability/' },
    { name: 'NAIC — Disability Income Insurance', url: 'https://content.naic.org/' }
  ]
});

// 3. Umbrella Insurance Calculator
pages.push({
  slug: 'umbrella-insurance-calculator',
  breadcrumbName: 'Umbrella Insurance Calculator',
  title: 'Umbrella Insurance Calculator — How Much Coverage Do You Need? | Insurance Calculator Hub',
  metaDescription: 'Estimate how much personal umbrella liability insurance you need based on your net worth and risk factors like teen drivers, pools, or rental property.',
  h1: 'Umbrella Insurance Calculator',
  badge: 'Liability Protection',
  calcHtml: `
    <h2 style="margin-top:0;font-size:1.2rem;">Estimate Your Umbrella Coverage</h2>
    <div class="calc-grid">
      <div class="field"><label>Total Assets ($)</label><input type="number" id="ui-assets" value="650000"><div class="hint">Home equity, investments, savings, retirement accounts.</div></div>
      <div class="field"><label>Total Liabilities ($)</label><input type="number" id="ui-liabilities" value="220000"></div>
      <div class="field"><label>Current Auto Liability Limit ($)</label><input type="number" id="ui-auto" value="300000"></div>
      <div class="field"><label>Current Home Liability Limit ($)</label><input type="number" id="ui-home" value="300000"></div>
      <div class="field"><label>Number of High-Risk Factors</label><input type="number" id="ui-risk" value="1"><div class="hint">Teen driver, pool/trampoline, rental property, dog breed, etc.</div></div>
    </div>
    <button class="calc-btn" onclick="calcUmbrella()">Calculate Recommended Coverage</button>
    <div class="result-box" id="ui-result" style="display:none;">
      <div class="result-row hero-result"><span class="k">Recommended Umbrella Coverage</span><span class="v" id="ui-total"></span></div>
      <div class="result-row"><span class="k">Net Worth</span><span class="v" id="ui-networth"></span></div>
      <div class="result-row"><span class="k">Underlying Liability Gap</span><span class="v" id="ui-gap"></span></div>
    </div>
  `,
  calcScript: `<script>
function calcUmbrella(){
  const assets=+document.getElementById('ui-assets').value||0;
  const liabilities=+document.getElementById('ui-liabilities').value||0;
  const auto=+document.getElementById('ui-auto').value||0;
  const home=+document.getElementById('ui-home').value||0;
  const risk=+document.getElementById('ui-risk').value||0;
  const netWorth=Math.max(0,assets-liabilities);
  let base=Math.max(1000000, Math.ceil(netWorth/1000000)*1000000);
  base += risk*1000000;
  const underlyingMin=Math.min(auto,home);
  const gap=Math.max(0,300000-underlyingMin);
  const fmt=n=>'$'+Math.round(n).toLocaleString();
  document.getElementById('ui-total').textContent=fmt(base);
  document.getElementById('ui-networth').textContent=fmt(netWorth);
  document.getElementById('ui-gap').textContent=gap>0?fmt(gap)+' (raise underlying limits first)':'None — underlying limits sufficient';
  document.getElementById('ui-result').style.display='block';
}
</script>`,
  content: `
    <h2>What Is Umbrella Insurance?</h2>
    <p>Personal umbrella insurance is extra liability coverage that kicks in once your auto or homeowners liability limits are exhausted — protecting your savings, home equity, and future income from a large lawsuit judgment (a serious car accident, an injury on your property, or a liability claim).</p>
    <h2>How Much Coverage Do You Need?</h2>
    <p>The standard industry guideline is to carry umbrella coverage equal to at least your total net worth, rounded up to the next $1,000,000 (most policies are sold in $1M increments), with a $1,000,000 minimum. Add coverage for each additional high-risk factor in your household — a teen driver, a swimming pool, a trampoline, a rental property, or a dog breed with bite-claim history all statistically raise your liability exposure.</p>
    <div class="disclaimer">Estimate only. Umbrella insurers typically require minimum underlying auto/home liability limits (often $250k-$300k) before issuing a policy. Confirm eligibility and pricing with a licensed insurance agent.</div>
  `,
  formula: 'Recommended Coverage = max($1,000,000, roundUp(Net Worth, $1,000,000)) + ($1,000,000 × Number of High-Risk Factors), where Net Worth = Total Assets − Total Liabilities',
  faq: [
    { q: 'How much does umbrella insurance cost?', a: 'Personal umbrella policies are famously inexpensive relative to the coverage — typically $150-$400/year for the first $1,000,000 of coverage, with additional millions costing less per increment.' },
    { q: 'Do I need umbrella insurance if I don\'t own a home?', a: 'Yes — renters with savings, investments, or future earning potential to protect can still be sued for amounts exceeding their auto liability limits. Net worth, not homeownership, is the key factor.' },
    { q: 'What does umbrella insurance NOT cover?', a: 'It generally excludes your own injuries or property damage (that\'s what health and property insurance are for), intentional acts, and business liability, which usually needs separate commercial coverage.' }
  ],
  sources: [
    { name: 'III — Insurance Information Institute: Umbrella Insurance', url: 'https://www.iii.org/article/what-is-personal-liability-insurance' }
  ]
});

// 4. COBRA Insurance Cost Calculator
pages.push({
  slug: 'cobra-insurance-calculator',
  breadcrumbName: 'COBRA Insurance Cost Calculator',
  title: 'COBRA Insurance Cost Calculator — Estimate Your Monthly Premium | Insurance Calculator Hub',
  metaDescription: 'Estimate your monthly COBRA health insurance premium after a job loss, including the standard 2% administration fee.',
  h1: 'COBRA Insurance Cost Calculator',
  badge: 'Job Transition',
  calcHtml: `
    <h2 style="margin-top:0;font-size:1.2rem;">Estimate Your COBRA Premium</h2>
    <div class="calc-grid">
      <div class="field"><label>Your Current Payroll Deduction ($/month)</label><input type="number" id="ci-employee" value="180"></div>
      <div class="field"><label>Employer's Monthly Contribution ($/month)</label><input type="number" id="ci-employer" value="620"><div class="hint">Ask HR/payroll — this is what your employer currently pays toward your plan.</div></div>
      <div class="field"><label>Admin Fee (%)</label><input type="number" id="ci-fee" value="2"><div class="hint">Federal law caps this at 2% for standard COBRA.</div></div>
      <div class="field"><label>Months of Coverage Needed</label><input type="number" id="ci-months" value="6"></div>
    </div>
    <button class="calc-btn" onclick="calcCobra()">Calculate COBRA Cost</button>
    <div class="result-box" id="ci-result" style="display:none;">
      <div class="result-row hero-result"><span class="k">Estimated Monthly COBRA Premium</span><span class="v" id="ci-monthly"></span></div>
      <div class="result-row"><span class="k">Total for Coverage Period</span><span class="v" id="ci-total"></span></div>
      <div class="result-row"><span class="k">Increase vs. Your Current Deduction</span><span class="v" id="ci-increase"></span></div>
    </div>
  `,
  calcScript: `<script>
function calcCobra(){
  const employee=+document.getElementById('ci-employee').value||0;
  const employer=+document.getElementById('ci-employer').value||0;
  const fee=+document.getElementById('ci-fee').value||0;
  const months=+document.getElementById('ci-months').value||0;
  const full=employee+employer;
  const monthly=full*(1+fee/100);
  const total=monthly*months;
  const increase=monthly-employee;
  const fmt=n=>'$'+Math.round(n).toLocaleString();
  document.getElementById('ci-monthly').textContent=fmt(monthly);
  document.getElementById('ci-total').textContent=fmt(total);
  document.getElementById('ci-increase').textContent='+'+fmt(increase)+'/mo';
  document.getElementById('ci-result').style.display='block';
}
</script>`,
  content: `
    <h2>How COBRA Pricing Works</h2>
    <p>COBRA (the Consolidated Omnibus Budget Reconciliation Act) lets you keep your employer's group health plan after leaving your job — but you pay the <em>full</em> premium yourself: the portion your employer used to cover, plus your own payroll deduction, plus a standard 2% administration fee.</p>
    <h2>Why COBRA Feels So Expensive</h2>
    <p>Most employees only see their own payroll deduction and never realize how much their employer was contributing until they lose that subsidy. This calculator adds both amounts together, applies the admin fee, and projects the total cost over your expected coverage window so you can compare it against marketplace (ACA) plans or a spouse's employer plan.</p>
    <div class="disclaimer">Estimate only. Actual COBRA premiums are set by your specific former employer's plan documents. Contact your HR department or plan administrator for your exact rate.</div>
  `,
  formula: 'Monthly COBRA Premium = (Employee Payroll Deduction + Employer Contribution) × (1 + Admin Fee %)',
  faq: [
    { q: 'How long does COBRA coverage last?', a: 'Typically up to 18 months after a qualifying event like job loss or reduced hours, though certain circumstances (disability, divorce, death of the covered employee) can extend it to 29 or 36 months.' },
    { q: 'Is COBRA cheaper than an ACA marketplace plan?', a: 'Not usually — because COBRA requires you to pay 100% of the premium plus a 2% fee, marketplace plans with income-based subsidies are frequently cheaper for the same coverage tier. Always compare both before deciding.' },
    { q: 'Can I decline COBRA and buy a marketplace plan instead?', a: 'Yes. Losing job-based coverage triggers a Special Enrollment Period for ACA marketplace plans, so you are not required to elect COBRA.' }
  ],
  sources: [
    { name: 'U.S. Department of Labor — COBRA Continuation Coverage', url: 'https://www.dol.gov/general/topic/health-plans/cobra' },
    { name: 'HealthCare.gov — Marketplace vs. COBRA', url: 'https://www.healthcare.gov/unemployed/cobra-coverage/' }
  ]
});

// 5. Title Insurance Calculator
pages.push({
  slug: 'title-insurance-calculator',
  breadcrumbName: 'Title Insurance Calculator',
  title: 'Title Insurance Calculator — Estimate Owner\'s & Lender\'s Policy Cost | Insurance Calculator Hub',
  metaDescription: 'Estimate the cost of owner\'s and lender\'s title insurance policies based on your home purchase price and loan amount.',
  h1: 'Title Insurance Calculator',
  badge: 'Home Closing Costs',
  calcHtml: `
    <h2 style="margin-top:0;font-size:1.2rem;">Estimate Your Title Insurance Cost</h2>
    <div class="calc-grid">
      <div class="field"><label>Home Purchase Price ($)</label><input type="number" id="ti-price" value="400000"></div>
      <div class="field"><label>Loan Amount ($)</label><input type="number" id="ti-loan" value="320000"><div class="hint">Leave at 0 if paying cash.</div></div>
    </div>
    <button class="calc-btn" onclick="calcTitle()">Calculate Title Insurance Cost</button>
    <div class="result-box" id="ti-result" style="display:none;">
      <div class="result-row hero-result"><span class="k">Total Estimated Title Insurance</span><span class="v" id="ti-total"></span></div>
      <div class="result-row"><span class="k">Owner's Policy (one-time, protects buyer)</span><span class="v" id="ti-owner"></span></div>
      <div class="result-row"><span class="k">Lender's Policy (one-time, protects lender)</span><span class="v" id="ti-lender"></span></div>
    </div>
  `,
  calcScript: `<script>
function calcTitle(){
  const price=+document.getElementById('ti-price').value||0;
  const loan=+document.getElementById('ti-loan').value||0;
  const owner=price*0.005;
  const lender=loan>0?loan*0.0025:0;
  const total=owner+lender;
  const fmt=n=>'$'+Math.round(n).toLocaleString();
  document.getElementById('ti-total').textContent=fmt(total);
  document.getElementById('ti-owner').textContent=fmt(owner);
  document.getElementById('ti-lender').textContent=fmt(lender);
  document.getElementById('ti-result').style.display='block';
}
</script>`,
  content: `
    <h2>Owner's vs. Lender's Title Insurance</h2>
    <p>Title insurance protects against defects in a property's ownership history — undisclosed liens, forged signatures, unpaid taxes, or fraud that could threaten your legal claim to the home. Unlike other insurance, it's a one-time premium paid at closing, not a recurring cost.</p>
    <ul>
      <li><strong>Owner's policy</strong> protects the buyer for as long as they (or their heirs) own the property, and is calculated on the purchase price.</li>
      <li><strong>Lender's policy</strong> protects the mortgage lender's interest up to the loan amount, and is typically required by any lender as a condition of the mortgage.</li>
    </ul>
    <p>This calculator uses a simplified national-average rate (roughly $5 per $1,000 of purchase price for the owner's policy, and $2.50 per $1,000 of loan amount for the lender's policy) — actual rates vary significantly by state, since some states regulate title insurance rates directly and others allow competitive pricing.</p>
    <div class="disclaimer">Estimate only. Title insurance rates are state-regulated and vary widely — get an itemized quote from a title company or your closing attorney for an exact figure.</div>
  `,
  formula: 'Owner\'s Policy = Purchase Price × 0.5% · Lender\'s Policy = Loan Amount × 0.25% · Total = Owner\'s Policy + Lender\'s Policy',
  faq: [
    { q: 'Do I really need title insurance?', a: 'Lender\'s title insurance is virtually always required if you\'re financing the purchase. Owner\'s title insurance is optional but strongly recommended — it\'s the only policy that protects your own equity in the home, not just the bank\'s.' },
    { q: 'Who pays for title insurance — buyer or seller?', a: 'It varies by state and local custom. In some states the seller customarily pays for the owner\'s policy, in others the buyer pays for both policies. Check local convention or ask your closing agent.' },
    { q: 'Is title insurance a one-time cost?', a: 'Yes — unlike homeowners or life insurance, title insurance is paid once at closing and covers you for as long as you (or your heirs) hold an interest in the property.' }
  ],
  sources: [
    { name: 'CFPB — What Is Title Insurance?', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-title-insurance-en-164/' },
    { name: 'ALTA — American Land Title Association', url: 'https://www.alta.org/' }
  ]
});

// 6. PMI Removal Calculator
pages.push({
  slug: 'pmi-removal-calculator',
  breadcrumbName: 'PMI Removal Calculator',
  title: 'PMI Removal Calculator — When Can You Cancel Private Mortgage Insurance? | Insurance Calculator Hub',
  metaDescription: 'Calculate your current loan-to-value ratio and find out when you can request PMI cancellation or when it automatically terminates.',
  h1: 'PMI Removal Calculator',
  badge: 'Mortgage Insurance',
  calcHtml: `
    <h2 style="margin-top:0;font-size:1.2rem;">Check Your PMI Removal Eligibility</h2>
    <div class="calc-grid">
      <div class="field"><label>Original Home Purchase Price / Appraised Value ($)</label><input type="number" id="pi-original" value="350000"></div>
      <div class="field"><label>Current Loan Balance ($)</label><input type="number" id="pi-balance" value="280000"></div>
      <div class="field"><label>Current Estimated Home Value ($)</label><input type="number" id="pi-current" value="380000"><div class="hint">If your home appreciated, you may qualify sooner via a new appraisal.</div></div>
      <div class="field"><label>Current Monthly PMI Payment ($)</label><input type="number" id="pi-pmi" value="140"></div>
    </div>
    <button class="calc-btn" onclick="calcPmi()">Check Eligibility</button>
    <div class="result-box" id="pi-result" style="display:none;">
      <div class="result-row hero-result"><span class="k">Current Loan-to-Value (LTV)</span><span class="v" id="pi-ltv"></span></div>
      <div class="result-row"><span class="k">Status</span><span class="v" id="pi-status"></span></div>
      <div class="result-row"><span class="k">Equity Needed to Reach 80% LTV</span><span class="v" id="pi-equity"></span></div>
      <div class="result-row"><span class="k">Annual PMI Cost If Not Removed</span><span class="v" id="pi-annual"></span></div>
    </div>
  `,
  calcScript: `<script>
function calcPmi(){
  const original=+document.getElementById('pi-original').value||0;
  const balance=+document.getElementById('pi-balance').value||0;
  const current=+document.getElementById('pi-current').value||0;
  const pmi=+document.getElementById('pi-pmi').value||0;
  const ltvOriginal=original>0?(balance/original)*100:0;
  const ltvCurrent=current>0?(balance/current)*100:0;
  const fmt=n=>'$'+Math.round(n).toLocaleString();
  document.getElementById('pi-ltv').textContent=ltvCurrent.toFixed(1)+'% (based on current value)';
  let status='', cls='';
  if(ltvOriginal<=78){status='Automatic termination required by law';cls='risk-low';}
  else if(ltvOriginal<=80){status='Eligible to request cancellation (original value)';cls='risk-low';}
  else if(ltvCurrent<=80){status='Likely eligible via new appraisal (appreciated value)';cls='risk-mid';}
  else{status='Not yet eligible — keep paying down principal';cls='risk-high';}
  const statusEl=document.getElementById('pi-status');
  statusEl.textContent=status;
  statusEl.className='v '+cls;
  const targetBalance=current*0.8;
  const equityNeeded=Math.max(0,balance-targetBalance);
  document.getElementById('pi-equity').textContent=fmt(equityNeeded);
  document.getElementById('pi-annual').textContent=fmt(pmi*12);
  document.getElementById('pi-result').style.display='block';
}
</script>`,
  content: `
    <h2>When Does PMI Come Off Your Mortgage?</h2>
    <p>Under the federal Homeowners Protection Act, lenders must <strong>automatically terminate</strong> PMI once your loan balance reaches 78% of the <em>original</em> home value (based on your amortization schedule). You can also proactively <strong>request cancellation</strong> once you reach 80% of the original value, or sooner if your home has appreciated — in that case, a new appraisal can prove you've reached 80% loan-to-value ahead of schedule.</p>
    <h2>How This Calculator Works</h2>
    <p>It computes your loan-to-value ratio two ways: against your original purchase price (the 78%/80% federal thresholds) and against your home's current estimated value (relevant if you're pursuing early removal via appraisal). It also shows how much annual PMI you're paying if you don't act, as motivation to check your eligibility regularly.</p>
    <div class="disclaimer">Estimate only. PMI removal policy and appraisal requirements vary by lender and loan type (conventional, FHA, etc. — note FHA loans use MIP, not PMI, and have different removal rules). Contact your loan servicer to confirm your exact eligibility.</div>
  `,
  formula: 'LTV = (Loan Balance ÷ Home Value) × 100. Automatic termination at LTV ≤ 78% of original value; eligible to request cancellation at LTV ≤ 80% of original value.',
  faq: [
    { q: 'What is the difference between PMI automatic termination and requested cancellation?', a: 'Automatic termination happens by law once your balance hits 78% of the original value, with no action needed on your part (as long as you\'re current on payments). Requested cancellation lets you remove PMI earlier, once you reach 80%, but you must proactively ask your servicer and may need to pay for a new appraisal.' },
    { q: 'Can I remove PMI faster if my home value went up?', a: 'Yes — many lenders allow early PMI removal based on a new appraisal showing you\'ve reached 80% loan-to-value using current market value, not just your original purchase price, though this typically requires a minimum 2 years of on-time payments (varies by lender).' },
    { q: 'Does PMI removal apply to FHA loans?', a: 'No — FHA loans use MIP (Mortgage Insurance Premium), which has separate rules and, on most FHA loans originated after 2013, cannot be removed without refinancing into a conventional loan.' }
  ],
  sources: [
    { name: 'Consumer Financial Protection Bureau — Homeowners Protection Act / PMI', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-135/' },
    { name: 'U.S. Code — Homeowners Protection Act of 1998 (12 U.S.C. § 4901)', url: 'https://www.govinfo.gov/content/pkg/USCODE-2021-title12/html/USCODE-2021-title12-chap49.htm' }
  ]
});

// ---------- Hub index page ----------

function buildIndex() {
  const cardIcons = { 'life-insurance-calculator':'❤️','disability-insurance-calculator':'🦽','umbrella-insurance-calculator':'☂️','cobra-insurance-calculator':'💼','title-insurance-calculator':'🏠','pmi-removal-calculator':'📉' };
  const cardShort = {
    'life-insurance-calculator': 'DIME method: estimate how much life insurance coverage your family actually needs.',
    'disability-insurance-calculator': 'Find your income-replacement gap between employer benefits and a target payout.',
    'umbrella-insurance-calculator': 'How much extra liability protection you need based on net worth and risk factors.',
    'cobra-insurance-calculator': 'Estimate your true monthly premium after a job loss, including the 2% admin fee.',
    'title-insurance-calculator': 'Estimate owner\'s and lender\'s title insurance cost at closing.',
    'pmi-removal-calculator': 'Check your loan-to-value ratio and find out when PMI comes off your mortgage.'
  };

  const hubGrid = pages.map(p => `
    <a class="hub-card" href="${p.slug}/">
      <div class="icon">${cardIcons[p.slug]}</div>
      <h3>${p.breadcrumbName}</h3>
      <p>${cardShort[p.slug]}</p>
    </a>`).join('');

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": cfg.siteName,
        "url": cfg.baseUrl + "/",
        "dateModified": cfg.lastReviewed,
        "author": orgJsonLd(cfg.siteName),
        "publisher": orgJsonLd(cfg.siteName)
      },
      {
        "@type": "ItemList",
        "itemListElement": pages.map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": p.breadcrumbName,
          "url": `${cfg.baseUrl}/${p.slug}/`
        }))
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Insurance Calculator Hub — Free Life, Disability, Umbrella &amp; Mortgage Insurance Calculators</title>
<meta name="description" content="Free, independent insurance calculators: life insurance needs, disability coverage gap, umbrella liability, COBRA cost, title insurance, and PMI removal.">
<link rel="canonical" href="${cfg.baseUrl}/">
<meta property="og:title" content="Insurance Calculator Hub">
<meta property="og:description" content="Free, independent insurance calculators for life, disability, umbrella, COBRA, title, and PMI.">
<meta property="og:url" content="${cfg.baseUrl}/">
<meta property="og:type" content="website">
<meta property="og:image" content="${cfg.baseUrl}/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Insurance Calculator Hub">
<meta name="twitter:description" content="Free, independent insurance calculators for life, disability, umbrella, COBRA, title, and PMI.">
<meta name="twitter:image" content="${cfg.baseUrl}/assets/og-image.png">
<link rel="stylesheet" href="assets/style.css">
<link rel="icon" href="assets/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<header class="site">
  <div class="wrap">
    <a href="./" class="brand"><span class="dot">🛡</span> Insurance Calculator Hub</a>
    <nav class="top">
      <a href="#calculators">Calculators</a>
      <a href="about/">About</a>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <span class="badge">6 Free Calculators</span><br>
    <h1>Insurance Calculators That Actually Explain the Math</h1>
    <p class="lead">Estimate life insurance needs, disability coverage gaps, umbrella liability, COBRA premiums, title insurance costs, and PMI removal eligibility — no signup, no email required.</p>
  </div>
</section>

<div class="wrap content" id="calculators">
  <div class="hub-grid">${hubGrid}</div>
  <h2>Why These Calculators?</h2>
  <p>Most insurance calculators online are lead-generation forms in disguise — you enter your details and get bombarded with agent calls instead of a number. Every calculator on this site runs entirely in your browser: nothing you type is sent anywhere. You get a transparent, explained estimate based on the same rules-of-thumb insurance professionals actually use (the DIME method, standard income-replacement ratios, federal PMI termination law, and typical title insurance rate structures).</p>
</div>

<footer class="site">
  <div class="wrap">
    <div class="cols">
      <div>
        <h4>Insurance Calculator Hub</h4>
        <p style="font-size:.82rem;max-width:360px;color:#94a3b8;">Free, independent insurance and mortgage-insurance calculators. Estimates only — always confirm figures with a licensed agent or your policy documents before making a decision.</p>
      </div>
      <div>
        <h4>Calculators</h4>
        ${pages.map(p => `<a href="${p.slug}/">${p.breadcrumbName}</a>`).join('\n        ')}
      </div>
      <div>
        <h4>Site</h4>
        <a href="about/">About &amp; Methodology</a>
      </div>
    </div>
    <div class="legal">
      <p>© ${new Date().getFullYear()} Insurance Calculator Hub. All calculators are for educational estimation purposes only and do not constitute insurance, financial, tax, or legal advice.</p>
      <p>Insurance Calculator Hub is part of ${cfg.legalName}, registered UK company number ${cfg.companyNumber}, registered office address at ${cfg.registeredOffice}.</p>
    </div>
  </div>
</footer>
</body>
</html>`;
}

function buildAbout() {
  return layout({
    slug: 'about',
    breadcrumbName: 'About',
    title: 'About Insurance Calculator Hub — Methodology & Legal Information',
    metaDescription: 'Learn about Insurance Calculator Hub\'s methodology, data sources, and the company behind the site.',
    h1: 'About Insurance Calculator Hub',
    badge: null,
    calcHtml: `<p style="margin:0;">Insurance Calculator Hub provides free, browser-only calculators for life, disability, umbrella, COBRA, title, and PMI insurance. No data you enter is transmitted or stored — every calculation runs locally in your browser using JavaScript.</p>`,
    calcScript: '',
    faq: [],
    content: `
      <h2>Our Methodology</h2>
      <p>Each calculator on this site is built around a documented, industry-standard rule of thumb — the DIME method for life insurance, standard income-replacement ratios for disability insurance, net-worth-based sizing for umbrella liability, the federal 2% COBRA administration fee cap, typical per-$1,000 title insurance rate structures, and the federal Homeowners Protection Act thresholds for PMI termination (78%/80% loan-to-value). None of these figures should replace an actual quote from a licensed professional — they exist to help you walk into that conversation already understanding the math.</p>
      <h2>Who Runs This Site</h2>
      <p>Insurance Calculator Hub is part of Gesmine-Invest Limited, registered UK company number 14120136, registered office address at Hardy House, 269 Poynders Gardens, London, London, United Kingdom, SW4 8PQ.</p>
    `
  });
}

// ---------- Write files ----------

fs.writeFileSync(path.join(__dirname, 'index.html'), buildIndex());
fs.mkdirSync(path.join(__dirname, 'about'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'about', 'index.html'), buildAbout());

for (const p of pages) {
  fs.mkdirSync(path.join(__dirname, p.slug), { recursive: true });
  fs.writeFileSync(path.join(__dirname, p.slug, 'index.html'), layout(p));
}

// sitemap + robots
const urls = ['', 'about/', ...pages.map(p => p.slug + '/')];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${cfg.baseUrl}/${u}</loc></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);

const robots = `User-agent: *
Allow: /

Sitemap: ${cfg.baseUrl}/sitemap.xml`;
fs.writeFileSync(path.join(__dirname, 'robots.txt'), robots);

console.log(`Generated ${pages.length} calculator pages + index + about. Sitemap: ${urls.length} URLs.`);
