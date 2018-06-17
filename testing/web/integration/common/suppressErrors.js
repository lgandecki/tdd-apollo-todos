const suppressedErrors = /(Could not parse CSS stylesheet|Invalid prop `optimisticResponse` of type `function` supplied to `Mutation`, expected `object`)/;
// eslint-disable-next-line no-console
const realConsoleError = console.error;
// eslint-disable-next-line no-console
console.error = message => {
  if (message.match(suppressedErrors)) {
    return;
  }
  realConsoleError("MINE OWN: ", message);
};
