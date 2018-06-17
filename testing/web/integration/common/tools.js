import waitForExpect from "wait-for-expect";
import { waitForElement as waitForElementOriginal } from "dom-testing-library";
import { fireEvent } from "react-testing-library";

export const wait = expectation => waitForExpect(expectation, 500);
export const waitForElement = expectation =>
  waitForElementOriginal(expectation, { timeout: 500 });
export const type = (el, value) => {
  fireEvent.focus(el);
  // eslint-disable-next-line no-param-reassign
  el.value = value;
  fireEvent.change(el);
};
