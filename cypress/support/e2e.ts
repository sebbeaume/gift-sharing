import './commands';

beforeEach(() => {
  cy.clearLocalStorage();
  cy.window().then(win => win.sessionStorage.clear());
});
