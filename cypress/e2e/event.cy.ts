import {
  EVENT_BACK_BTN,
  EVENT_ID_CODE,
  EVENT_COPY_BTN,
  EVENT_ADD_GIFT_BTN,
  EVENT_ADD_GIFT_FORM,
  EVENT_GIFT_NAME_INPUT,
  EVENT_GIFT_LINK_INPUT,
  EVENT_GIFT_PRICE_INPUT,
  EVENT_GIFT_SUBMIT,
  EVENT_EMPTY_STATE,
  EVENT_GIFT_ITEM,
  EVENT_GIFT_NAME,
  EVENT_GIFT_LINK,
  EVENT_GIFT_PRICE,
  EVENT_GIFT_STATUS_BTN,
  EVENT_GIFT_REMOVE_BTN,
  EVENT_CONTRIBUTE_BTN,
  EVENT_CONTRIBUTE_FORM,
  EVENT_CONTRIBUTE_AMOUNT_INPUT,
  EVENT_CONTRIBUTE_SUBMIT,
  EVENT_CONTRIBUTIONS_TOTAL,
  EVENT_CONTRIBUTION_ITEM,
  EVENT_GIFT_CONTRIBUTE_BTN,
  EVENT_GIFT_CONTRIBUTE_FORM,
  EVENT_GIFT_CONTRIBUTE_AMOUNT_INPUT,
  EVENT_GIFT_CONTRIBUTE_SUBMIT,
  EVENT_GIFT_PROGRESS_BAR,
  EVENT_GIFT_PROGRESS_TOOLTIP,
} from '../../src/pages/EventPageTestIds';

const EVENT = {
  id: 'evt-abc-123',
  name: "Carol's Wedding",
  date: '2026-09-20',
  password: 'wedding2026',
  gifts: [],
  contributions: [],
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

  it('adds a gift with a link and price and shows all details', () => {
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_GIFT_NAME_INPUT).type('Headphones');
    cy.getByTestId(EVENT_GIFT_LINK_INPUT).type('https://www.amazon.com/dp/example');
    cy.getByTestId(EVENT_GIFT_PRICE_INPUT).type('299.99');
    cy.getByTestId(EVENT_GIFT_SUBMIT).click();
    cy.getByTestId(EVENT_GIFT_NAME).contains('Headphones');
    cy.getByTestId(EVENT_GIFT_LINK)
      .should('have.attr', 'href', 'https://www.amazon.com/dp/example')
      .and('have.attr', 'target', '_blank')
      .and('contain', 'View listing');
    cy.getByTestId(EVENT_GIFT_PRICE).contains('€299.99');
  });

  it('does not show a link when none is provided', () => {
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_GIFT_NAME_INPUT).type('Book');
    cy.getByTestId(EVENT_GIFT_SUBMIT).click();
    cy.getByTestId(EVENT_GIFT_LINK).should('not.exist');
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

describe('Event Page — contributions', () => {
  beforeEach(visitEvent);

  it('shows the contributions section with a €0.00 total', () => {
    cy.getByTestId(EVENT_CONTRIBUTIONS_TOTAL).should('contain', '€0.00');
  });

  it('shows the contribute form when clicking "+ Contribute"', () => {
    cy.getByTestId(EVENT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_CONTRIBUTE_FORM).should('be.visible');
    cy.getByTestId(EVENT_CONTRIBUTE_AMOUNT_INPUT).should('exist');
  });

  it('toggles the button label to "Cancel" when the form is open', () => {
    cy.getByTestId(EVENT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_CONTRIBUTE_BTN).should('contain', 'Cancel');
  });

  it('hides the form when clicking Cancel', () => {
    cy.getByTestId(EVENT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_CONTRIBUTE_FORM).should('not.exist');
  });

  it('adds a contribution and updates the total', () => {
    cy.getByTestId(EVENT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_CONTRIBUTE_AMOUNT_INPUT).type('25');
    cy.getByTestId(EVENT_CONTRIBUTE_SUBMIT).click();
    cy.getByTestId(EVENT_CONTRIBUTIONS_TOTAL).should('contain', '€25.00');
    cy.getByTestId(EVENT_CONTRIBUTION_ITEM).should('have.length', 1);
    cy.getByTestId(EVENT_CONTRIBUTION_ITEM).first().should('contain', '€25.00');
  });

  it('accumulates multiple contributions in the total', () => {
    cy.getByTestId(EVENT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_CONTRIBUTE_AMOUNT_INPUT).type('10');
    cy.getByTestId(EVENT_CONTRIBUTE_SUBMIT).click();

    cy.getByTestId(EVENT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_CONTRIBUTE_AMOUNT_INPUT).type('15.50');
    cy.getByTestId(EVENT_CONTRIBUTE_SUBMIT).click();

    cy.getByTestId(EVENT_CONTRIBUTIONS_TOTAL).should('contain', '€25.50');
    cy.getByTestId(EVENT_CONTRIBUTION_ITEM).should('have.length', 2);
  });

  it('clears the form and hides it after submitting a contribution', () => {
    cy.getByTestId(EVENT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_CONTRIBUTE_AMOUNT_INPUT).type('50');
    cy.getByTestId(EVENT_CONTRIBUTE_SUBMIT).click();
    cy.getByTestId(EVENT_CONTRIBUTE_FORM).should('not.exist');
    cy.getByTestId(EVENT_CONTRIBUTE_BTN).should('contain', '+ Contribute');
  });
});

// ── Helper to add a gift with a price ──────────────────────────────────────
const addGiftWithPrice = (name: string, price: string) => {
  cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
  cy.getByTestId(EVENT_GIFT_NAME_INPUT).type(name);
  cy.getByTestId(EVENT_GIFT_PRICE_INPUT).type(price);
  cy.getByTestId(EVENT_GIFT_SUBMIT).click();
};

describe('Event Page — per-gift contributions', () => {
  beforeEach(visitEvent);

  it('shows the Contribute button on a suggested gift with a price', () => {
    addGiftWithPrice('Headphones', '100');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).should('exist').and('contain', 'Contribute');
  });

  it('does not show the Contribute button on a gift without a price', () => {
    cy.getByTestId(EVENT_ADD_GIFT_BTN).click();
    cy.getByTestId(EVENT_GIFT_NAME_INPUT).type('Mystery book');
    cy.getByTestId(EVENT_GIFT_SUBMIT).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).should('not.exist');
  });

  it('opens the inline contribute form when clicking Contribute', () => {
    addGiftWithPrice('Camera', '200');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_FORM).should('be.visible');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_AMOUNT_INPUT).should('exist');
  });

  it('toggles the button label to Cancel when the form is open', () => {
    addGiftWithPrice('Camera', '200');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).should('contain', 'Cancel');
  });

  it('hides the form when clicking Cancel', () => {
    addGiftWithPrice('Camera', '200');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_FORM).should('not.exist');
  });

  it('shows the progress bar after a partial contribution', () => {
    addGiftWithPrice('Headphones', '100');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_AMOUNT_INPUT).type('40');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_SUBMIT).click();
    cy.getByTestId(EVENT_GIFT_PROGRESS_BAR).should('exist');
  });

  it('enforces a max contribution equal to the remaining balance', () => {
    addGiftWithPrice('Jacket', '80');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_AMOUNT_INPUT)
      .should('have.attr', 'max', '80.00');
  });

  it('updates the max after a prior contribution is made', () => {
    addGiftWithPrice('Jacket', '80');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_AMOUNT_INPUT).type('30');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_SUBMIT).click();

    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_AMOUNT_INPUT)
      .should('have.attr', 'max', '50.00');
  });

  it('shows contribution breakdown in the tooltip on hover', () => {
    addGiftWithPrice('Headphones', '100');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_AMOUNT_INPUT).type('35');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_SUBMIT).click();

    cy.getByTestId(EVENT_GIFT_PROGRESS_BAR).trigger('mouseenter');
    cy.getByTestId(EVENT_GIFT_PROGRESS_TOOLTIP)
      .should('be.visible')
      .and('contain', '€35.00');
  });

  it('auto-marks gift as purchased when fully funded', () => {
    addGiftWithPrice('Book', '50');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_AMOUNT_INPUT).type('50');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_SUBMIT).click();

    cy.getByTestId(EVENT_GIFT_ITEM).should('have.class', 'purchased');
    cy.getByTestId(EVENT_GIFT_STATUS_BTN).should('contain', '✓ Purchased');
  });

  it('hides the Contribute button once the gift is fully funded', () => {
    addGiftWithPrice('Book', '50');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_AMOUNT_INPUT).type('50');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_SUBMIT).click();

    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).should('not.exist');
  });

  it('does not show the Contribute button on a manually-purchased gift', () => {
    addGiftWithPrice('Scarf', '30');
    cy.getByTestId(EVENT_GIFT_STATUS_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).should('not.exist');
  });

  it('clears the form and hides it after submitting a gift contribution', () => {
    addGiftWithPrice('Watch', '150');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_AMOUNT_INPUT).type('60');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_SUBMIT).click();
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_FORM).should('not.exist');
    cy.getByTestId(EVENT_GIFT_CONTRIBUTE_BTN).should('contain', 'Contribute');
  });
});
