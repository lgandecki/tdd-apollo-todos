/* eslint-env jest, cypress/globals */
describe("working with the server", () => {
  it("shows lists coming from the server", () => {
    cy.visit("http://localhost:3000");
    cy.contains("second list");
    cy.contains("first list");
  });
});
