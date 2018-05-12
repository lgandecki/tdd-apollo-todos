import waitForExpect from "wait-for-expect";
import { Simulate } from "react-testing-library";

export const wait = expectation => waitForExpect(expectation, 500);
export const type = (el, value) => {
  Simulate.focus(el);
  // eslint-disable-next-line no-param-reassign
  el.value = value;
  Simulate.change(el);
};
