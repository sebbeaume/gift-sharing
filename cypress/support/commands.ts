import type { GiftEvent } from '../../src/types';

const STORAGE_KEY = 'gift-sharing-events';
const AUTH_KEY = 'gift-sharing-auth';

Cypress.Commands.add('seedEvent', (event: GiftEvent) => {
  cy.window().then(win => {
    const existing = JSON.parse(win.localStorage.getItem(STORAGE_KEY) ?? '[]');
    win.localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, event]));
  });
});

Cypress.Commands.add('authenticate', (eventId: string) => {
  cy.window().then(win => {
    const existing = JSON.parse(win.sessionStorage.getItem(AUTH_KEY) ?? '[]');
    if (!existing.includes(eventId)) {
      win.sessionStorage.setItem(AUTH_KEY, JSON.stringify([...existing, eventId]));
    }
  });
});

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

declare global {
  namespace Cypress {
    interface Chainable {
      seedEvent(event: GiftEvent): Chainable<void>;
      authenticate(eventId: string): Chainable<void>;
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
