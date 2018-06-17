/* eslint-env jest */
import { loadedApp } from "./common/loadedApp";
import { wait, type } from "./common/tools";

// jest fake timers
test("rename todo by typing", async () => {
  const { getTodoByText, todoItemsRepository } = await loadedApp();

  const todoToChange = getTodoByText("first todo in the first list");
  type(todoToChange, "different text now");

  await wait(() =>
    expect(
      todoItemsRepository.todoItemsCollection.findOne({
        text: "different text now"
      })
    ).resolves.not.toBeNull()
  );
});
