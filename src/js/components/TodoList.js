import { ENV } from "../env.js";


class TodoList extends HTMLElement
{
   list = [];

   constructor()
   {
      super();

      this.innerHTML = `
                          <input id="todo-input"
                                 placeholder="Write your todos here"></input>

                          <button id="todo-btn">Save To-do item</button>

                          <h3>
                             To-do items
                          </h3>

                          <ul id="the-list">
                          </ul>
                       `;

      this.list = this.fetchTodoItems()
                      .then((items) =>
                            {
                               this.updateTodoList(items);
                            });

      let btn = this.querySelector("#todo-btn");
      let input = this.querySelector("#todo-input");

      btn.onclick = () =>
                    {
                       let todoToSave = input.value;

                       if (!todoToSave) alert("Cannot save a blank to-do item!");
                       else
                       {
                          this.saveTodo(todoToSave)
                              .then(() =>
                                    {
                                       return this.fetchTodoItems();
                                    })
                              .then((items) =>
                                    {
                                       this.updateTodoList(items);
                                       input.value = ""; // Clear the input field after saving
                                    });
                       }
                    };
   }
