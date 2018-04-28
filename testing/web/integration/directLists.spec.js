/* eslint-env jest */
import React from "react";
import { render, wait } from "react-testing-library";
import { ApolloProvider } from "react-apollo";
import listsResolvers from "../../../server/src/api/graphql/lists/listsResolvers";
import gqlClient from "../../../testing/common/gqlClient";
import getListsWithDefaults from "../../../testing/common/getListsWithDefaults";
import Routes from "../../../web/src/Routes";

test("Rendering component connected to the server", async () => {
  const listsRepository = await getListsWithDefaults();
  const { getByText } = render(
    <ApolloProvider
      client={gqlClient({
        context: { listsRepository },
        resolvers: [listsResolvers]
      })}
    >
      <Routes />
    </ApolloProvider>
  );
  expect(getByText("loading")).toBeDefined();
  await wait(() => getByText("second list"), { timeout: 500 });
});
