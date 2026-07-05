# Budget Ledger — React Frontend (Step 1 of 7)

This is the React + Vite conversion of the Budget Ledger tool. It keeps the
original design and calculation logic, split into reusable components, and
is wired up to call a backend (built in Step 2) for AI analysis and history.

## Components

- `Navbar` — switches between Planner and History views
- `BudgetForm` — combines income, expenses, goals, chart, and summary
- `IncomeInput` — monthly income field
- `ExpenseSection` — reusable list for fixed/variable expense line items
- `GoalSection` — savings + debt payoff goal inputs
- `AllocationChart` — ledger-tape bar + Recharts pie chart
- `SummaryCard` — totals table and plain-language verdict
- `AIRecommendation` — renders the Gemini-generated advice
- `BudgetHistory` — lists saved budgets, with view/delete

## Running it

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173`. API calls to `/api/*` are proxied
to `http://localhost:8080` (the Spring Boot backend from Step 2) — see
`vite.config.js`. Until the backend exists, clicking "Analyze Budget" will
fail with a network error; that's expected at this stage.

## What's stubbed for now

- `src/services/api.js` already has the four functions the backend will
  need to support: `analyzeBudget`, `saveBudget`, `getHistory`,
  `deleteHistoryEntry`. They call `/api/budget/...` exactly as specified.
- `BudgetHistory` and `AIRecommendation` are fully built against the
  expected response shapes — no changes needed once the backend is live.

## Next steps

- Step 2: Spring Boot backend (`/api/budget/analyze`, `/save`, `/history`, `/history/{id}`)
- Step 3: MongoDB integration
- Step 4: Gemini integration
- Step 5: Budget history persistence (already wired on the frontend)
- Step 6: Charts (pie chart already included; income-vs-expense and savings-progress charts come with real history data)
- Step 7: Final testing
