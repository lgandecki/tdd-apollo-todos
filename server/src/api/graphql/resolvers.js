import merge from "lodash/merge";
import listsResolvers from "./lists/listsResolvers";
import todoItemResolvers from "./todoItems/todoItemsResolvers";
import usersResolvers from "./users/usersResolvers";

export const resolvers = merge(
  {},
  listsResolvers,
  todoItemResolvers,
  usersResolvers
);
