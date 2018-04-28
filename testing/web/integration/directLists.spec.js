/* eslint-env jest */
import React from "react";
import { render, wait } from "react-testing-library";
import { ApolloProvider } from "react-apollo";
import PureLists from "../../../web/src/scenes/Lists/PureLists";
import Lists from "../../../web/src/scenes/Lists/Lists";
import listsResolvers from "../../../server/src/api/graphql/lists/listsResolvers";
import gqlClient from "../../../testing/common/gqlClient";
import getListsWithDefaults from "../../../testing/common/getListsWithDefaults";

test("Rendering the pure component", () => {
  const { getByText } = render(<PureLists />);
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
      <Lists />
    </ApolloProvider>
  );
  expect(getByText("loading")).toBeDefined();
  await wait(() => getByText("second list"), { timeout: 500 });
});
