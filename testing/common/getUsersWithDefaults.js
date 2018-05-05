import { UsersRepository } from "../../server/src/api/graphql/users/UsersRepository";

export default async function getUsersWithDefaults() {
  const usersRepository = new UsersRepository();
  return usersRepository;
}
