Write or maintain Cypress E2E tests for this project. Use this command when a new feature is built, a test is failing, or tests need updating after a refactor.

## Project setup

- Config: `cypress.config.ts` — `baseUrl: http://localhost:5173`
- Support: `cypress/support/e2e.ts` — clears `localStorage` and `sessionStorage` before every test
- Tests: `cypress/e2e/home.cy.ts`, `cypress/e2e/event.cy.ts`
- Custom commands: `cypress/support/commands.ts`

## Custom commands

```ts
cy.seedEvent(event: GiftEvent)     // writes event to localStorage under 'gift-sharing-events'
cy.authenticate(eventId: string)   // writes eventId to sessionStorage under 'gift-sharing-auth'
cy.getByTestId(testId: string)     // shorthand for cy.get(`[data-testid="${testId}"]`)
```

To set up an authenticated EventPage test, always use the `visitEvent` pattern:
```ts
const visitEvent = () => {
  cy.visit('/');         // load the app first so window is available
  cy.seedEvent(EVENT);
  cy.authenticate(EVENT.id);
  cy.visit(`/event/${EVENT.id}`);
};
```

## Selecting elements — data-testid convention

All selectors in tests must use `data-testid` attributes via `cy.getByTestId()`. Never select by CSS class, element type, or placeholder text.

### TestIds files

Every page component has a sibling `*TestIds.ts` file that exports string constants:

```
src/pages/
├── HomePage.tsx
├── HomePageTestIds.ts     ← constants for HomePage
├── EventPage.tsx
└── EventPageTestIds.ts    ← constants for EventPage
```

**Naming conventions:**
- File: `<PageName>TestIds.ts` next to the component file
- Constant: `SCREAMING_SNAKE_CASE` (e.g. `HOME_CREATE_BTN`)
- Value: `PageName__elementDescription` in camelCase (e.g. `'HomePage__createBtn'`)

**Example — defining:**
```ts
// HomePageTestIds.ts
export const HOME_CREATE_BTN        = 'HomePage__createBtn';
export const HOME_CREATE_NAME_INPUT = 'HomePage__createNameInput';
export const HOME_CREATE_SUBMIT     = 'HomePage__createSubmit';
```

**Example — applying in the component:**
```tsx
// HomePage.tsx
import { HOME_CREATE_BTN, HOME_CREATE_NAME_INPUT, HOME_CREATE_SUBMIT } from './HomePageTestIds';

<button data-testid={HOME_CREATE_BTN} ...>Create an Event</button>
<input  data-testid={HOME_CREATE_NAME_INPUT} ... />
<button data-testid={HOME_CREATE_SUBMIT} type="submit">Create</button>
```

**Example — using in tests:**
```ts
// home.cy.ts
import { HOME_CREATE_BTN, HOME_CREATE_NAME_INPUT, HOME_CREATE_SUBMIT } from '../../src/pages/HomePageTestIds';

cy.getByTestId(HOME_CREATE_BTN).click();
cy.getByTestId(HOME_CREATE_NAME_INPUT).type("Alice's Birthday");
cy.getByTestId(HOME_CREATE_SUBMIT).click();
```

### Available TestIds

**HomePageTestIds.ts**
- `HOME_CREATE_BTN`, `HOME_JOIN_BTN` — card buttons
- `HOME_CREATE_NAME_INPUT`, `HOME_CREATE_DATE_INPUT`, `HOME_CREATE_PASSWORD_INPUT` — create form inputs
- `HOME_CREATE_SUBMIT`, `HOME_CREATE_CANCEL` — create form actions
- `HOME_JOIN_ID_INPUT`, `HOME_JOIN_PASSWORD_INPUT` — join form inputs
- `HOME_JOIN_SUBMIT`, `HOME_JOIN_CANCEL` — join form actions
- `HOME_JOIN_ERROR` — error message paragraph

**EventPageTestIds.ts**
- `EVENT_BACK_BTN`, `EVENT_ID_CODE`, `EVENT_COPY_BTN` — header / ID box
- `EVENT_ADD_GIFT_BTN`, `EVENT_ADD_GIFT_FORM` — gift form toggle and container
- `EVENT_GIFT_NAME_INPUT`, `EVENT_GIFT_DESC_INPUT`, `EVENT_GIFT_PRICE_INPUT`, `EVENT_GIFT_SUBMIT` — add gift form fields
- `EVENT_EMPTY_STATE` — empty list message
- `EVENT_GIFT_ITEM`, `EVENT_GIFT_NAME`, `EVENT_GIFT_DESC`, `EVENT_GIFT_PRICE` — gift list item and its parts
- `EVENT_GIFT_STATUS_BTN`, `EVENT_GIFT_REMOVE_BTN` — gift item actions

## Known pitfalls

**Date inputs require the native setter trick.**
React 19 doesn't pick up `.invoke('val', ...).trigger('change')` for date inputs. Use the native prototype setter to bypass React's value tracking, then fire both `input` and `change` events:
```ts
cy.getByTestId(HOME_CREATE_DATE_INPUT).then($el => {
  const input = $el[0] as HTMLInputElement;
  const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  nativeSetter?.call(input, '2026-12-25');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
});
```

**Verify the actual day of week before asserting formatted dates.**
`new Date('YYYY-MM-DD')` parses as UTC midnight. Always verify the weekday (e.g. `September 20, 2026` is a Sunday) before writing a formatted date assertion.

## Test file conventions

- Group tests by page and feature using nested `describe` blocks
- Use `beforeEach` to set up shared state (e.g. `beforeEach(visitEvent)`)
- Seed only the minimum data needed for each test
- Assert against the DOM, not internal state

## When writing new tests

1. Read the relevant source file in `src/pages/` to understand what the UI renders
2. Check the corresponding `*TestIds.ts` file — use existing constants, add new ones if needed
3. Add `data-testid={CONSTANT}` to any element in the component that isn't already tagged
4. Read the existing spec for the same page (if any) to follow established patterns
5. Add new `describe` blocks for new features rather than appending to existing ones

## When fixing failing tests

1. Run `npm run cypress:run` to get the full failure output
2. Read the failing spec and the source component together
3. Check for: renamed TestId constants, removed elements, updated text content, or timing issues
4. Fix the test to match the current implementation — never change the implementation to match the test unless the implementation itself is wrong
