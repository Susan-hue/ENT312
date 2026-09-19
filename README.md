# ENT 312 CBT Practice

Computer-based test (CBT) practice app for **ENT 312 — Entrepreneurship and Venture Creation** (300L, second semester). Questions cover the full textbook (Chapters 1–20).

## Features

- **Full test** — Random questions from all chapters (default 50, configurable up to 215).
- **Practice by chapter** — Select one or more chapters; all questions from those chapters are included and shuffled.
- **CBT-style quiz** — One question at a time; no right/wrong feedback until you submit.
- **Results** — Overall score, breakdown by chapter, and full review with explanations.
- **Retry incorrect only** — Start a new quiz using only questions you missed.
- **Progress saved locally** — In-progress attempts persist across refresh (browser `localStorage`).
- **Mobile-friendly** — Safe-area layout, large touch targets, sticky quiz controls.

## Tech stack

- [Next.js](https://nextjs.org/) 14 (App Router)
- React 18
- Tailwind CSS
- Static JSON question bank (no backend or database)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Use the default settings (framework: Next.js). No extra configuration required.

## Question data

Questions live in `src/data/questions.json`. Each item includes chapter, topic, options (A–D), correct answer, and explanation.

## License

For personal and educational study use.
