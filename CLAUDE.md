# Gift Sharing — Project Context

## What this app does
A collaborative gift planning web app. Users create or join an event using a shared event ID and password. No user accounts — anyone with the correct credentials can view and edit the event.

## Tech stack
- React 19 + TypeScript (Vite, `react-ts` template)
- React Router v7
- No backend — data persists in `localStorage`, auth in `sessionStorage`
- Node.js v18.15.0 (older, causes engine warnings on npm install — harmless)

## Project structure
```
src/
├── types/index.ts          # GiftEvent, Gift (use `type`, not `interface`)
├── utils/storage.ts        # localStorage CRUD (getEvent, saveEvent, updateEvent)
├── utils/auth.ts           # sessionStorage auth (isAuthenticated, setAuthenticated)
├── pages/HomePage.tsx      # Create event / Join event forms
├── pages/EventPage.tsx     # View & manage gifts for an event
├── App.tsx                 # BrowserRouter + Routes
└── index.css               # All styles (no CSS modules)
```

## Key conventions
- Use `type` not `interface` for TypeScript types
- All styles live in `index.css` using plain class names
- `crypto.randomUUID()` for generating IDs
- All color values must be named CSS custom properties defined in `:root` — no raw hex codes in rules

## Data model
```ts
type Gift = {
  id: string; name: string; link?: string;
  price?: number; status: 'suggested' | 'purchased';
  contributions: Contribution[];
}
type Contribution = {
  id: string; amount: number; createdAt: string;
}
type GiftEvent = {
  id: string; name: string; date: string;
  password: string; gifts: Gift[]; contributions: Contribution[]; createdAt: string;
}
```

> **Backwards compat:** `getEvents()` in `storage.ts` defaults `contributions` to `[]` for both event-level and gift-level contributions for data stored before these fields existed.

## Auth flow
1. Create event → saved to localStorage → event ID stored in sessionStorage → redirect to `/event/:id`
2. Join event → look up by ID → compare password → store in sessionStorage → redirect
3. EventPage checks `isAuthenticated(id)` on mount — redirects to `/` if not authenticated

## Dev server
```bash
npm run dev   # http://localhost:5173
```
Launch config saved at `.claude/launch.json` (use `preview_start` with name `"gift-sharing-dev"`).

**Windows note:** `npm` cannot be spawned directly — `launch.json` must use `cmd.exe` as `runtimeExecutable` with `["/c", "npm run dev"]` as `runtimeArgs`.

## Project commands
Custom slash commands live in `.claude/commands/`:
- `/doc-agent` — reviews the conversation and updates `CLAUDE.md` with new conventions or corrections

## PR screenshots practice

Every PR that changes visible UI **must include screenshots** in the PR description showing the affected states.

### How to capture screenshots

A dedicated Cypress spec lives at `cypress/e2e/screenshots.cy.ts`. Run it after starting the dev server:

```bash
npm run dev &           # start dev server
npx cypress run --spec cypress/e2e/screenshots.cy.ts
```

Screenshots are written to `cypress/screenshots/UI Screenshots/`. Commit them to the branch, then embed in the PR description using relative paths or GitHub's drag-and-drop image upload.

> **When implementing UI features:** after writing and committing the feature code, run the screenshot spec, commit the generated images, and add them to the PR description before pushing.

## What's been built
- [x] HomePage with Create / Join forms and error handling
- [x] EventPage with gift list (add, toggle purchased, remove)
- [x] Event ID copy-to-clipboard button
- [x] Add-gift form with name, link (URL, optional), and price fields; gifts display a "View listing ↗" anchor when a link is provided
- [x] Contributions section on EventPage: users can contribute a money amount; running total is displayed; each contribution is listed with its date
- [x] Per-gift contributions: "Contribute" button on each suggested gift with a price; inline amount form with max capped at remaining balance; progress bar showing funded %; tooltip on hover with per-contribution breakdown; gift auto-marks as purchased when fully funded
