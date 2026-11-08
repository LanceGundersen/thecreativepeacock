# thecreativepeacock.com

One-page site for The Creative Peacock by Christen Gundersen (DIY, cozy home,
thrift flips). Static HTML/CSS/JS on Cloudflare Pages. No framework, no build
step, no database, no backend.

```
public/       everything that gets served
  index.html
  style.css
  main.js     peacock fan + eye tracking, word reveal, parallax
  img/
  _headers
wrangler.jsonc
```

## Run locally

```bash
npm install
npm run dev          # http://localhost:8788
```

## Deploy

```bash
npx wrangler login
export CLOUDFLARE_ACCOUNT_ID=<account id>
npx wrangler pages project create thecreativepeacock --production-branch main
npm run deploy -- --project-name thecreativepeacock --branch main
```

Default URL: `https://thecreativepeacock.pages.dev`. To go live, attach
`thecreativepeacock.com` as a custom domain on the Pages project (the domain
must be on Cloudflare).

## Content notes

Pulled from her public pages: Instagram `@the_creative_peacock`, YouTube
`@Thecreativepeacock`, Facebook, Pinterest, Linktree `tcpstudio`, the Gumroad
book (`gundersen16.gumroad.com/l/rstfn`, $15, 26-page PDF), and the Amazon and
Walmart storefront links.

- `book.jpg` is the product cover from Gumroad.
- `flip1-6.jpg` (thrift-flip wall) and `hero.jpg` (cozy band) are Unsplash
  placeholders. Replace with her own stills. Keep the filenames, or edit
  `index.html`. About 1100px wide for flips, 2000px for the band, JPEG 70-75.
- The affiliate disclosure under "Shop my picks" should be confirmed by her.
- Brand colors come from her logo: lime `#a6d63a`, purple `#7a3fb0`, magenta
  `#d1239b`, plus plum and teal for depth.

## Credits (placeholder photography, Unsplash)

cin ., Kate Bezzubets, Sophia Kunkel, mohsen ameri, Louis Le Pessot, Seiji Seiji,
Spacejoy.
