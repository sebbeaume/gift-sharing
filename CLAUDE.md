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
  id: string; name: string; description?: string;
  price?: number; status: 'suggested' | 'purchased';
}
type GiftEvent = {
  id: string; name: string; date: string;
  password: string; gifts: Gift[]; createdAt: string;
}
```

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

## What's been built
- [x] HomePage with Create / Join forms and error handling
- [x] EventPage with gift list (add, toggle purchased, remove)
- [x] Event ID copy-to-clipboard button
- [ ] Nothing else yet — this is the starting point for the next session
