/* eslint-env cypress/globals */
import { graphql } from "graphql";
import getGraphqlSchema from "../grahqlSchema";

const graphqlFetch = (win, customResolvers) => {
  cy.stub(win, "fetch", (...args) => {
    const [url, request] = args;
    const postBody = JSON.parse(request.body);
    let promise;
    if (url.indexOf("graphql") !== -1) {
      const { query, variables, operationName } = postBody;
      promise = Promise.resolve({
        ok: true,
        text() {
          return graphql(
            getGraphqlSchema(customResolvers),
            query,
            null,
            null,
            variables,
            operationName
          ).then(result => JSON.stringify(result));
        }
      });
    }
    if (promise) {
      return promise;
    }
    return false;
  });
};

export const mockGraphqlWithResolvers = resolvers => ({
  onBeforeLoad: fetch => graphqlFetch(fetch, resolvers)
});
