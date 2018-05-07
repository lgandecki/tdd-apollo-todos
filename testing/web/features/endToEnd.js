/* eslint-env jest, cypress/globals */

const Simulate = {
  click: el => {
    el.click();
  }
};

const type = (el, value) => {
  el.type(value, { delay: 1 });
};
const { getByText, getByPlaceholderText, queryByText } = cy;
describe("working with the server", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  it("shows lists coming from the server", () => {
    getByText("second list");
  });
  it("allows the user to sign up and log out", () => {
    Simulate.click(getByText("Join"));
    type(getByPlaceholderText("Your Email"), "lgandecki@thebrain.pro");
    type(getByPlaceholderText("Password"), "MyPassword");
    type(getByPlaceholderText("Confirm Password"), "MyPassword");
    Simulate.click(getByText("Join Now"));
    getByText("lgandecki");
    queryByText("Join Now").should("not.exist");
  });
});
