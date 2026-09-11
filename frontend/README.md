# CarbonGuard Dashboard

React + TypeScript dashboard for CarbonGuard ESG results. The frontend submits activity records through a server-side SuperFlow proxy and renders the returned governance/audit result.

## Safety boundary

The browser does **not** calculate emissions, select factors, or store the SuperFlow webhook secret. Live numerical results come from the Lyzr SuperFlow pipeline and deterministic backend tools.

## Commands

```bash
npm install
npm run typecheck
npm run build
npm test
npm run dev
```
