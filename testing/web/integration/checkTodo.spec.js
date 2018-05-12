import { fireEvent } from "react-testing-library";
import { wait } from "./common/tools";
import { loadedApp } from "./common/loadedApp";

test("check and uncheck todo", async () => {
  const { getByTitle, getByTestId } = await loadedApp();

  fireEvent.click(getByTitle("check-first todo in the first list"));

  await wait(() =>
    expect(
      getByTestId("checkbox-first todo in the first list").checked
    ).toEqual(true)
  );

  fireEvent.click(getByTitle("check-first todo in the first list"));

  await wait(() =>
    expect(
      getByTestId("checkbox-first todo in the first list").checked
    ).toEqual(false)
  );
});
