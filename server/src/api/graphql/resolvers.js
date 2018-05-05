import merge from "lodash/merge";
import listsResolvers from "./lists/listsResolvers";
import todoItemResolvers from "./todoItems/todoItemsResolvers";

export const resolvers = merge({}, listsResolvers, todoItemResolvers);
