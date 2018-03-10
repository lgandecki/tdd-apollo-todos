const lists = [
  {
    _id: "firstId",
    name: "first list",
    incompleteCount: 0
  },
  {
    _id: "secondId",
    name: "second list",
    incompleteCount: 4
  }
];
export default {
  Query: {
    Lists: () => lists
  }
};
