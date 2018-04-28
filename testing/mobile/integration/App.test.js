/* eslint-env jest */
import React from "react";
import { render, wait } from "react-testing-library";
import { ApolloProvider } from "react-apollo";

import listsResolvers from "../../../server/src/api/graphql/lists/listsResolvers";
import AppWithApollo from "../../../mobile/AppWithApollo";
import getListsWithDefaults from "../../common/getListsWithDefaults";
import gqlClient from "../../common/gqlClient";

test.skip("Rendering component connected to the server", async () => {
  const listsRepository = await getListsWithDefaults();
  const { getByText } = render(
    <ApolloProvider
      client={gqlClient({
        context: { listsRepository },
        resolvers: [listsResolvers]
      })}
    >
      <AppWithApollo />
    </ApolloProvider>
  );

  expect(getByText("loading")).toBeDefined();
  await wait(() => getByText("second list"), { timeout: 500 });
});
