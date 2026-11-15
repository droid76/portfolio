# Portfolio site

Static site in `site/` (plain HTML, CSS, JS; no build step). `content/` holds the LinkedIn snapshot it was written from and is not deployed.

## Preview locally

    cd site && python3 -m http.server 8080    # then open http://localhost:8080

## Deploy to Cloudflare Pages

Option A, GitHub (auto-deploys on every push):
1. Create an empty repo, e.g. github.com/droid76/portfolio, and push this folder.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Build settings: framework "None", build command empty, output directory `site`.

Option B, direct upload:

    npx wrangler@latest login
    npx wrangler@latest pages deploy site --project-name akshay-portfolio

## Custom domain
Cloudflare → Workers & Pages → the project → Custom domains → add the domain bought in Cloudflare Registrar.

## Contact form
Create a form at formspree.io, then replace `YOUR_FORM_ID` in `site/index.html` with the form ID.

## Resume
`site/Akshay_Kumar_Resume.pdf` is the approved Apple Security Platform Automation resume with the phone number removed.
