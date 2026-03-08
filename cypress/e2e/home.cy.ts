import {
  HOME_CREATE_BTN,
  HOME_JOIN_BTN,
  HOME_CREATE_NAME_INPUT,
  HOME_CREATE_DATE_INPUT,
  HOME_CREATE_PASSWORD_INPUT,
  HOME_CREATE_SUBMIT,
  HOME_CREATE_CANCEL,
  HOME_JOIN_ID_INPUT,
  HOME_JOIN_PASSWORD_INPUT,
  HOME_JOIN_SUBMIT,
  HOME_JOIN_CANCEL,
  HOME_JOIN_ERROR,
} from '../../src/pages/HomePageTestIds';

describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows the app title and both action buttons', () => {
    cy.contains('h1', 'Gift Sharing');
    cy.getByTestId(HOME_CREATE_BTN);
    cy.getByTestId(HOME_JOIN_BTN);
  });

  // ── Create form ────────────────────────────────────────────

  it('opens the create form when clicking "Create an Event"', () => {
    cy.getByTestId(HOME_CREATE_BTN).click();
    cy.contains('h2', 'Create Event');
    cy.getByTestId(HOME_CREATE_NAME_INPUT).should('exist');
    cy.getByTestId(HOME_CREATE_DATE_INPUT).should('exist');
    cy.getByTestId(HOME_CREATE_PASSWORD_INPUT).should('exist');
  });

  it('closes the create form when clicking Cancel', () => {
    cy.getByTestId(HOME_CREATE_BTN).click();
    cy.getByTestId(HOME_CREATE_CANCEL).click();
    cy.contains('h2', 'Create Event').should('not.exist');
  });

  it('creates an event and redirects to the event page', () => {
    cy.getByTestId(HOME_CREATE_BTN).click();
    cy.getByTestId(HOME_CREATE_NAME_INPUT).type("Alice's Birthday");
    cy.getByTestId(HOME_CREATE_DATE_INPUT).then($el => {
      const input = $el[0] as HTMLInputElement;
      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      nativeSetter?.call(input, '2026-12-25');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    cy.getByTestId(HOME_CREATE_PASSWORD_INPUT).type('secret123');
    cy.getByTestId(HOME_CREATE_SUBMIT).click();
    cy.url().should('match', /\/event\/.+/);
    cy.contains("Alice's Birthday");
  });

  // ── Join form ──────────────────────────────────────────────

  it('opens the join form when clicking "Join an Event"', () => {
    cy.getByTestId(HOME_JOIN_BTN).click();
    cy.contains('h2', 'Join Event');
    cy.getByTestId(HOME_JOIN_ID_INPUT).should('exist');
  });

  it('closes the join form when clicking Cancel', () => {
    cy.getByTestId(HOME_JOIN_BTN).click();
    cy.getByTestId(HOME_JOIN_CANCEL).click();
    cy.contains('h2', 'Join Event').should('not.exist');
  });

  it('shows an error when joining with an unknown event ID', () => {
    cy.getByTestId(HOME_JOIN_BTN).click();
    cy.getByTestId(HOME_JOIN_ID_INPUT).type('non-existent-id');
    cy.getByTestId(HOME_JOIN_PASSWORD_INPUT).type('anypassword');
    cy.getByTestId(HOME_JOIN_SUBMIT).click();
    cy.getByTestId(HOME_JOIN_ERROR).contains('No event found with that ID.');
  });

  it('shows an error when joining with the wrong password', () => {
    cy.seedEvent({
      id: 'test-event-id',
      name: "Bob's Party",
      date: '2026-06-15',
      password: 'correctpass',
      gifts: [],
      createdAt: new Date().toISOString(),
    });

    cy.getByTestId(HOME_JOIN_BTN).click();
    cy.getByTestId(HOME_JOIN_ID_INPUT).type('test-event-id');
    cy.getByTestId(HOME_JOIN_PASSWORD_INPUT).type('wrongpass');
    cy.getByTestId(HOME_JOIN_SUBMIT).click();
    cy.getByTestId(HOME_JOIN_ERROR).contains('Incorrect password. Please try again.');
  });

  it('joins an existing event with correct credentials and redirects', () => {
    cy.seedEvent({
      id: 'test-event-id',
      name: "Bob's Party",
      date: '2026-06-15',
      password: 'correctpass',
      gifts: [],
      createdAt: new Date().toISOString(),
    });

    cy.getByTestId(HOME_JOIN_BTN).click();
    cy.getByTestId(HOME_JOIN_ID_INPUT).type('test-event-id');
    cy.getByTestId(HOME_JOIN_PASSWORD_INPUT).type('correctpass');
    cy.getByTestId(HOME_JOIN_SUBMIT).click();
    cy.url().should('include', '/event/test-event-id');
    cy.contains("Bob's Party");
  });
});
