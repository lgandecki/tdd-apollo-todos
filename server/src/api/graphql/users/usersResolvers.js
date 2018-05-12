import { isEmpty } from "lodash";

export default {
  Query: {
    CurrentUser: (_, input, context) => {
      if (!isEmpty(context.user)) {
        return context.user;
      }
      return undefined;
    }
  },
  Mutation: {
    AddUser: async (_, input, context) => {
      const user = await context.usersRepository.createUser(input);
      context.req.logIn(user, err => {
        if (err) throw err;
      });
      return user;
    },
    LoginUser: async (_, input, context) => {
      const user = await context.usersRepository.findByUsernameAndPassword(
        input
      );
      if (user) {
        context.req.logIn(user, err => {
          if (err) throw err;
        });
      }
      return user;
    },
    LogoutUser: (_, input, context) => context.req.logOut()
  }
};
