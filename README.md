# 🎁 Gift Sharing

A collaborative gift planning web app. Create an event, share the ID and password with your group, and coordinate gifts together — no accounts needed.

> **About this project:** This app was built entirely using [Claude Code](https://claude.ai/claude-code) (Anthropic's agentic AI coding assistant), under my supervision. It is a hands-on exploration of agentic AI-assisted development — from feature implementation to testing strategy, tooling setup, and project conventions. Every decision was guided by me, every line was written by Claude.

---

## Tech stack

| Layer | Technology |
|---|---|
| UI | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Bundler | [Vite](https://vitejs.dev/) |
| Routing | [React Router v7](https://reactrouter.com/) |
| Styling | Plain CSS with custom properties (no framework) |
| Persistence | `localStorage` (no backend) |
| Auth | `sessionStorage` (no accounts — shared event ID + password) |
| Testing | [Cypress](https://www.cypress.io/) E2E |

---

## Getting started

### Prerequisites

- Node.js ≥ 18

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
# → http://localhost:5173
```

### Build for production

```bash
npm run build
```

---

## Testing

Tests are written with Cypress and cover all current features end-to-end.

```bash
# Run all tests headlessly
npm run cypress:run

# Open the interactive Cypress UI
npm run cypress:open
```

> The dev server must be running before executing tests.

### Test structure

```
cypress/
├── e2e/
│   ├── home.cy.ts      # HomePage — create/join forms, validation, redirects
│   └── event.cy.ts     # EventPage — auth guard, gift CRUD, status toggle
└── support/
    ├── commands.ts     # Custom commands: cy.seedEvent(), cy.authenticate(), cy.getByTestId()
    └── e2e.ts          # Global beforeEach — clears storage between tests
```

All selectors use `data-testid` attributes. Test ID constants are co-located with their components:

```
src/pages/
├── HomePage.tsx
├── HomePageTestIds.ts
├── EventPage.tsx
└── EventPageTestIds.ts
```

---

## How it works

1. **Create an event** — give it a name, date and password. The event is saved to `localStorage` and you're redirected to the event page.
2. **Share** the event ID (copy button) and password with your group.
3. **Join an event** — paste the event ID and enter the password from the home page.
4. **Manage gifts** — add gifts with optional description and price, mark them as purchased, remove them.

Authentication is session-based: once you create or join an event, the event ID is stored in `sessionStorage` for the duration of the browser session.

---

## Project conventions

- TypeScript `type` (not `interface`) for all data models
- All styles in `src/index.css` — no CSS modules, no framework
- All colors as named CSS custom properties in `:root` — no raw hex values in rules
- `data-testid` attributes on all interactive elements, defined as constants in `*TestIds.ts` files
