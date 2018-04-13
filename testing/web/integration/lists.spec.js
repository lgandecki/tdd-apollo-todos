/* eslint-env jest */
import React from "react";
import { render, wait } from "react-testing-library";
import { ApolloProvider } from "react-apollo";

import PureApp from "web/src/scenes/App/PureApp";
import App from "web/src/scenes/App/App";
import listsResolvers from "server/src/api/graphql/lists/listsResolvers";

import gqlClient from "../../common/gqlClient";
import getListsWithDefaults from "../../common/getListsWithDefaults";

test("Rendering the pure component", () => {
  const { getByText } = render(<PureApp />);
  expect(getByText("loading")).toBeDefined();
});

test("Rendering component connected to the server", async () => {
  const listsRepository = await getListsWithDefaults();
  const { getByText } = render(
    <ApolloProvider
      client={gqlClient({
        context: { listsRepository },
        resolvers: [listsResolvers]
      })}
    >
      <App />
    </ApolloProvider>
  );
  expect(getByText("loading")).toBeDefined();
  await wait(() => getByText("second list"), { timeout: 500 });
});
