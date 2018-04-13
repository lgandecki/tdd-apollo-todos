// eslint-disable-next-line import/no-extraneous-dependencies
const { importSchema } = require("graphql-import");

const schema = importSchema(
  `${__dirname}/../server/src/api/graphql/schema.graphql`
);

console.log(schema);
