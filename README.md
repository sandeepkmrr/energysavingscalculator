# Daikin Inverter RTU Demo

A Next.js demo showcasing a Daikin-branded experience for comparing rooftop unit energy savings. The app implements a three-step wizard with landing, configuration, and results dashboards, plus a PDF preview modal.

## Features

- Landing page with Daikin styling and shared sustainability banner/footer
- Wizard flow (`/wizard/project`, `/wizard/system`, `/wizard/results`) backed by a persistent context
- Mock ZIP lookup, system configuration, and savings calculation (2 s simulated delay)
- Executive results dashboard with KPI animations, charts, and PDF preview
- Responsive layout using Tailwind CSS and shadcn/ui components

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js App Router (TypeScript)
- Tailwind CSS + shadcn/ui
- Recharts for visualizations

## Notes

- Results use `MOCK_PROJECT` data in `lib/mockData.ts`
- PDF downloads a placeholder file (`public/daikin-report.pdf`)
- Demo badge (“Demo — For Proposal Only”) clarifies the experience is for proposal purposes only
