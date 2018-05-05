export default {
  Query: {
    CurrentUser: (_, input, context) => {
      console.log("Gandecki context", context.user);
      return context.user;
    }
  },
  Mutation: {
    AddUser: async (_, input, context) => {
      const user = await context.usersRepository.createUser(input);
      console.log("Gandecki user", user);
      context.req.logIn(user, err => {
        if (err) throw err;
      });
      return user;
    },
    LoginUser: (_, input, context) =>
      context.usersRepository.findByUsernameAndPassword(input)
  }
};
