/**
 * Screenshot capture spec — not part of the test suite.
 * Run this spec to generate UI screenshots for PR documentation:
 *   npx cypress run --spec cypress/e2e/screenshots.cy.ts
 * Screenshots are saved to cypress/screenshots/.
 */

import type { GiftEvent } from '../../src/types';

const EVENT: GiftEvent = {
  id: 'screenshot-event-1',
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

describe('UI Screenshots', () => {
  it('home page', () => {
    cy.visit('/');
    cy.screenshot('01-home-page', { overwrite: true });
  });

  it('event page — empty state', () => {
    visitEvent();
    cy.screenshot('02-event-empty', { overwrite: true });
  });

  it('event page — add gift form open', () => {
    visitEvent();
    cy.get('[data-testid="EventPage__addGiftBtn"]').click();
    cy.screenshot('03-add-gift-form', { overwrite: true });
  });

  it('event page — gift list', () => {
    visitEvent();
    // Add a gift without price
    cy.get('[data-testid="EventPage__addGiftBtn"]').click();
    cy.get('[data-testid="EventPage__giftNameInput"]').type('Photo book');
    cy.get('[data-testid="EventPage__giftSubmit"]').click();
    // Add a gift with price
    cy.get('[data-testid="EventPage__addGiftBtn"]').click();
    cy.get('[data-testid="EventPage__giftNameInput"]').type('Headphones');
    cy.get('[data-testid="EventPage__giftPriceInput"]').type('100');
    cy.get('[data-testid="EventPage__giftSubmit"]').click();
    cy.screenshot('04-gift-list', { overwrite: true });
  });

  it('event page — contribute form open', () => {
    visitEvent();
    cy.get('[data-testid="EventPage__addGiftBtn"]').click();
    cy.get('[data-testid="EventPage__giftNameInput"]').type('Headphones');
    cy.get('[data-testid="EventPage__giftPriceInput"]').type('100');
    cy.get('[data-testid="EventPage__giftSubmit"]').click();
    cy.get('[data-testid="EventPage__giftContributeBtn"]').click();
    cy.screenshot('05-contribute-form', { overwrite: true });
  });

  it('event page — progress bar after partial contribution', () => {
    visitEvent();
    cy.get('[data-testid="EventPage__addGiftBtn"]').click();
    cy.get('[data-testid="EventPage__giftNameInput"]').type('Headphones');
    cy.get('[data-testid="EventPage__giftPriceInput"]').type('100');
    cy.get('[data-testid="EventPage__giftSubmit"]').click();
    cy.get('[data-testid="EventPage__giftContributeBtn"]').click();
    cy.get('[data-testid="EventPage__giftContributeAmountInput"]').type('40');
    cy.get('[data-testid="EventPage__giftContributeSubmit"]').click();
    cy.screenshot('06-progress-bar', { overwrite: true });
  });

  it('event page — tooltip on hover', () => {
    visitEvent();
    cy.get('[data-testid="EventPage__addGiftBtn"]').click();
    cy.get('[data-testid="EventPage__giftNameInput"]').type('Headphones');
    cy.get('[data-testid="EventPage__giftPriceInput"]').type('100');
    cy.get('[data-testid="EventPage__giftSubmit"]').click();
    cy.get('[data-testid="EventPage__giftContributeBtn"]').click();
    cy.get('[data-testid="EventPage__giftContributeAmountInput"]').type('40');
    cy.get('[data-testid="EventPage__giftContributeSubmit"]').click();
    cy.get('[data-testid="EventPage__giftProgressWrapper"]').trigger('mouseover');
    cy.get('[data-testid="EventPage__giftProgressTooltip"]').should('be.visible');
    cy.screenshot('07-contribution-tooltip', { overwrite: true });
  });

  it('event page — fully funded (auto-purchased)', () => {
    visitEvent();
    cy.get('[data-testid="EventPage__addGiftBtn"]').click();
    cy.get('[data-testid="EventPage__giftNameInput"]').type('Headphones');
    cy.get('[data-testid="EventPage__giftPriceInput"]').type('100');
    cy.get('[data-testid="EventPage__giftSubmit"]').click();
    cy.get('[data-testid="EventPage__giftContributeBtn"]').click();
    cy.get('[data-testid="EventPage__giftContributeAmountInput"]').type('100');
    cy.get('[data-testid="EventPage__giftContributeSubmit"]').click();
    cy.screenshot('08-fully-funded-purchased', { overwrite: true });
  });
});
