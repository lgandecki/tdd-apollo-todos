import { map } from "lodash";
import { MsSQLRepository } from "../../common/MsSQLRepository";
// import Sequelize from "Sequelize"
const Sequelize = require("sequelize");

export class TodoItemsRepository extends MsSQLRepository {
  init() {
    this.TodoItem = this.sequelize.define("TodoItem", {
      text: Sequelize.STRING,
      checked: Sequelize.BOOLEAN,
      listId: Sequelize.STRING
    });

    return this.TodoItem.sync();
  }

  async getItemsFor({ listId }) {
    const all = await this.TodoItem.findAll({
      where: {
        listId
      }
    });
    return map(all, "dataValues").map(item => ({
      _id: item.id,
      ...item
    }));
  }

  removeItem({ itemId }) {
    return this.TodoItem.destroy({ where: { id: itemId } });
  }

  async addTodo({ text, listId }) {
    const { dataValues } = await this.TodoItem.create({
      text,
      listId,
      checked: false
    });
    return { _id: dataValues.id, ...dataValues };
  }

  async toggleTodoCheck({ itemId, checked }) {
    await this.TodoItem.update(
      { checked },
      {
        where: {
          id: itemId
        }
      }
    );
    return { _id: itemId, checked };
  }

  async renameTodo({ todoId, newText }) {
    await this.TodoItem.update(
      {
        text: newText
      },
      {
        where: { id: todoId }
      }
    );
    return { id: todoId, text: newText };
  }
}

export const todoItemsRepository = new TodoItemsRepository();
