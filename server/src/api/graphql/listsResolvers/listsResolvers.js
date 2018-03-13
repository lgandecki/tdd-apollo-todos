import { listsRepository } from "../../repositories/ListsRepository";

export default {
  Query: {
    Lists: () => listsRepository.getLists()
  }
};
