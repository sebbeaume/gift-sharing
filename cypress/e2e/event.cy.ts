import {
  EVENT_BACK_BTN,
  EVENT_ID_CODE,
  EVENT_COPY_BTN,
  EVENT_ADD_GIFT_BTN,
  EVENT_ADD_GIFT_FORM,
  EVENT_GIFT_NAME_INPUT,
  EVENT_GIFT_DESC_INPUT,
  EVENT_GIFT_PRICE_INPUT,
  EVENT_GIFT_SUBMIT,
  EVENT_EMPTY_STATE,
  EVENT_GIFT_ITEM,
  EVENT_GIFT_NAME,
  EVENT_GIFT_DESC,
  EVENT_GIFT_PRICE,
  EVENT_GIFT_STATUS_BTN,
  EVENT_GIFT_REMOVE_BTN,
} from '../../src/pages/EventPageTestIds';

const EVENT = {
  id: 'evt-abc-123',
  name: "Carol's Wedding",
  date: '2026-09-20',
  password: 'wedding2026',
  gifts: [],
  createdAt: new Date().toISOString(),
};

const visitEvent = () => {
  cy.visit('/');
  cy.seedEvent(EVENT);
  cy.authenticate(EVENT.id);
  cy.visit(`/event/${EVENT.id}`);
};

describe('Event Page — auth guard', () => {
  it('redirects to home when not authenticated', () => {
    cy.visit('/');
    cy.seedEvent(EVENT);
    cy.visit(`/event/${EVENT.id}`);
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });
});

describe('Event Page — layout', () => {
  beforeEach(visitEvent);

  it('shows the event name and date', () => {
    cy.contains('h1', "Carol's Wedding");
    cy.contains('Sunday, September 20, 2026');
  });

  it('shows the event ID with a Copy button', () => {
    cy.contains('Event ID:');
    cy.getByTestId(EVENT_ID_CODE).contains(EVENT.id);
    cy.getByTestId(EVENT_COPY_BTN).should('exist');
  });

  it('shows the empty state when there are no gifts', () => {
    cy.getByTestId(EVENT_EMPTY_STATE).should('exist');
  });

  it('navigates back to home when clicking ← Back', () => {
    cy.getByTestId(EVENT_BACK_BTN).click();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });
});

describe('Event Page — add gift form', () => {
  beforeEach(visitEvent);

  it('shows the add gift form when clicking "+ Add Gift"', () => {
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_ADD_GIFT_FORM).should('be.visible');
    cy.getByTestId(EVENT_GIFT_NAME_INPUT).should('exist');
  });

  it('toggles the button label to "Cancel" when form is open', () => {
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_ADD_GIFT_BTN).contains('Cancel');
  });

  it('hides the form when clicking Cancel', () => {
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_ADD_GIFT_FORM).should('not.exist');
  });
});

describe('Event Page — gift list', () => {
  beforeEach(visitEvent);

  it('adds a gift with name only and shows it in the list', () => {
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_GIFT_NAME_INPUT).type('Book');
    cy.getByTestId(EVENT_GIFT_SUBMIT).click();
    cy.getByTestId(EVENT_GIFT_NAME).contains('Book');
  });

  it('adds a gift with description and price and shows all details', () => {
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_GIFT_NAME_INPUT).type('Headphones');
    cy.getByTestId(EVENT_GIFT_DESC_INPUT).type('Sony WH-1000XM5');
    cy.getByTestId(EVENT_GIFT_PRICE_INPUT).type('299.99');
    cy.getByTestId(EVENT_GIFT_SUBMIT).click();
    cy.getByTestId(EVENT_GIFT_NAME).contains('Headphones');
    cy.getByTestId(EVENT_GIFT_DESC).contains('Sony WH-1000XM5');
    cy.getByTestId(EVENT_GIFT_PRICE).contains('€299.99');
  });

  it('clears the form and hides it after adding a gift', () => {
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_GIFT_NAME_INPUT).type('Scarf');
    cy.getByTestId(EVENT_GIFT_SUBMIT).click();
    cy.getByTestId(EVENT_ADD_GIFT_FORM).should('not.exist');
  });

  it('marks a gift as purchased and shows the purchased state', () => {
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_GIFT_NAME_INPUT).type('Candle');
    cy.getByTestId(EVENT_GIFT_SUBMIT).click();
    cy.getByTestId(EVENT_GIFT_STATUS_BTN).click();
    cy.getByTestId(EVENT_GIFT_STATUS_BTN).contains('✓ Purchased');
    cy.getByTestId(EVENT_GIFT_ITEM).should('have.class', 'purchased');
  });

  it('toggles a purchased gift back to suggested', () => {
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_GIFT_NAME_INPUT).type('Candle');
    cy.getByTestId(EVENT_GIFT_SUBMIT).click();
    cy.getByTestId(EVENT_GIFT_STATUS_BTN).click();
    cy.getByTestId(EVENT_GIFT_STATUS_BTN).click();
    cy.getByTestId(EVENT_GIFT_STATUS_BTN).contains('Mark purchased');
  });

  it('removes a gift from the list', () => {
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_GIFT_NAME_INPUT).type('Flowers');
    cy.getByTestId(EVENT_GIFT_SUBMIT).click();
    cy.getByTestId(EVENT_GIFT_NAME).contains('Flowers');
    cy.getByTestId(EVENT_GIFT_REMOVE_BTN).click();
    cy.getByTestId(EVENT_GIFT_ITEM).should('not.exist');
    cy.getByTestId(EVENT_EMPTY_STATE).should('exist');
  });
});
