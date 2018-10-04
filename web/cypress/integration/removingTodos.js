/* eslint-env cypress/globals */
/* eslint-disable prefer-arrow-callback,func-names,jest/valid-expect */

import { mockGraphqlWithResolvers } from "./helpers/mockGraphqlWithResolvers";

// cy.stub("")
describe("Deleting Todos", () => {
  const deletingItemsResolvers = () => ({
    Mutation: {
      RemoveItem: cy.stub()
    },
    Query: {
      Lists: () => [
        {
          todos: [
            { _id: "leaveThisOne", text: "Leave this one" },
            { _id: "toBeRemoved", text: "Remove this one" }
          ]
        }
      ]
    }
  });

  function removeTodo(todoName) {
    return cy
      .getByValue(todoName)
      .parent()
      .within(() => {
        cy.getByTestId("deleteItem").click({ force: true });
      });
  }

  it("Removes the selected todo from the existing list server-side", () => {
    const resolvers = deletingItemsResolvers();
    cy.visit("/", mockGraphqlWithResolvers(resolvers));

    removeTodo("Remove this one").then(() => {
      expect(resolvers.Mutation.RemoveItem).to.be.calledWith(null, {
        itemId: "toBeRemoved"
      });
    });
  });
  // not sure if it's worth to split this into two tests
  it("Removes the selected todo from the existing list client-side, leaving the rest intact", () => {
    cy.visit("/", mockGraphqlWithResolvers(deletingItemsResolvers()));

    removeTodo("Remove this one").then(() => {
      // the "should not exist" doesn't wait - this has to be
      // fixed in the cypress-testing-library. hacky wait for now.
      // cy.getByValue("Remove this one").should("not.exist");

      cy.get(':input[value="Remove this one"]').should("not.exist");
    });
  });
  it("updates the number of todos in a list", () => {});
});
