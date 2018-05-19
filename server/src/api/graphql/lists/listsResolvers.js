import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

export default {
  Query: {
    Lists: (_, input, context) =>
      context.listsRepository.getLists({ user: context.user })
  },
  Mutation: {
    AddList: async (_, { listName }, context) => {
      const list = await context.listsRepository.addList({ listName });
      pubsub.publish("listAdded", list);
      return list;
    },
    RemoveList: (_, { listId }, context) =>
      context.listsRepository.removeList({ user: context.user, listId }),
    ChangeListName: (_, { listId, newName }, context) =>
      context.listsRepository.changeListName({
        listId,
        newName,
        user: context.user
      }),
    ToggleListPrivacy: (_, { listId }, context) =>
      context.listsRepository.toggleListPrivacy({
        _id: listId,
        userId: context.user._id
      })
  },
  List: {
    todos: (list, args, context) =>
      context.todoItemsRepository.getItemsFor({ listId: list._id })
  },
  Subscription: {
    AddedList: {
      resolve: payload => payload,
      subscribe: () => pubsub.asyncIterator("listAdded")
    }
  }
};
