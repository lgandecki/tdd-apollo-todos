import merge from "lodash/merge";

async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export const slowDownMutations = mutationNames =>
  merge(
    ...mutationNames.map(name => ({ Mutation: { [name]: () => sleep(10000) } }))
  );
