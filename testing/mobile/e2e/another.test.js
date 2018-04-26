/* eslint-env jest, node */
/* global element by device waitFor */

const { reloadApp } = require("detox-expo-helpers");
const detox = require("detox");
const config = require("../../../mobile/package.json").detox;

afterAll(async () => {
  await detox.cleanup();
});

jest.setTimeout(40000);

const getADriver = async () => {
  await waitFor(element(by.id("skip_intro_button")))
    .toBeVisible()
    .withTimeout(10000);
};

describe("Example", async () => {
  beforeAll(async () => {
    await detox.init(config);
    if (process.env.DETOX_EXTERNAL_LINK) {
      console.log("starting detox external link");
      const expUrl = process.env.DETOX_EXTERNAL_LINK;
      console.log("Gandecki expUrl", expUrl);
      await device.launchApp({
        newInstance: true,
        url: expUrl,
        launchArgs: { EXKernelDisableNuxDefaultsKey: true }
      });
    } else {
      await reloadApp();
    }
    console.log("finished reloading");
  });

  it(
    "should have welcome screen",
    async () => {
      await getADriver();
    },
    40000
  );
});
