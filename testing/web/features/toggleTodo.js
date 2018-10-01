/* eslint-env jest, cypress/globals */

const { getByTestId, getByTitle } = cy;

// eslint-disable-next-line jest/no-hooks
beforeEach(() => {
  cy.visit("http://localhost:3000");
});

describe("Toggling TODO", () => {
  it("Marks TODO as done", () => {
    getByTitle("check-first todo in the first list").click();
    getByTestId("checkbox-first todo in the first list").should("be.checked");
  });
});
