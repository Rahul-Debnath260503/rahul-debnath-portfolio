# Rahul Debnath — Portfolio

A responsive portfolio for Rahul Debnath, an AI/ML and GeoAI engineer. The visual system is built around geospatial signals, orbital motion, and model telemetry.

## Run locally

```bash
npm install
npm run dev
```

## Production check

```bash
npm run lint
npm run build
```

## Edit content

Most personal content, links, metrics, experience, and project information live in `src/data/portfolio.ts`. Layout is in `src/App.tsx`, and visual styling is in `src/App.css`.

## Deploy

Import this repository into Vercel and accept the detected Vite defaults. Every push to the main branch will update the public URL automatically. Netlify and GitHub Pages also work; the production output folder is `dist`.

## Notes

- The résumé served from `site-public/Rahul_Debnath_CV.pdf` should be replaced whenever the source CV changes.
- Add a 1200 × 630 social preview image and reference it with an `og:image` meta tag before launch.
- All visuals and animations in this version are code-generated; no proprietary assets from the reference template are shipped.
