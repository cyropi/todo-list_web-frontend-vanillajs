
const API_URL = "http://localhost:3000"


class TodoList extends HTMLElement
{
    list = [];

    constructor()
    {
        super();

        this.innerHTML = ` <input id="todo-input" 
                                  placeholder="Write your todos here"></input>

                           <button id="todo-btn">Save To-do item</button>

                           <h3>
                               To-do items
                           </h3>

                           <ul id="the-list"></ul>
                         `;

        this.list = this.fetchTodoItems()
                        .then((items) => { this.updateTodoList(items) });
        
        let btn = this.querySelector('#todo-btn');
        let input = this.querySelector('#todo-input');

        btn.onclick = () => {
                                let todoToSave = input.value;

                                if (!todoToSave)
                                    alert("Cannot save a blank to-do item!");
                                else
                                {
                                    this.saveTodo(todoToSave).then(() => { return this.fetchTodoItems() })
                                                             .then((items) => { 
                                                                                  this.updateTodoList(items);
                                                                                  input.value = ""; // Clear the input field after saving
                                                                              });
                                }
                            };
    }


    async fetchTodoItems()
    {
        let token = localStorage.getItem("token"); // Retrieve the token

        let response = await fetch(API_URL + "/todos",
                                   { 
                                       method: "GET",
                                       headers: { "Authorization": "Bearer " + token } // Inject token
                                   });

        if (response.status === 401)
        {
            localStorage.removeItem("token"); // Destroy the invalid token

            history.pushState("", "", "/login?error=unauthorized"); // Redirect with error flag
            window.dispatchEvent(new Event("popstate"));

            return null;
        }

        return response.json() // parse JSON response into JS Objects
    }


    updateTodoList(list)
    {
        console.log(list);

        let todosArray = list.todos;

        let ul = this.querySelector("#the-list");
        ul.innerHTML = ""; // remove all child elements and re-create them. Not the most efficient thing to do.

        for (let item of todosArray)
        {
            let li = document.createElement("li");
            li.innerHTML = `${item.todo} <a href="#" data-delete="${item.id}">(delete)</a>`;
            ul.append(li);
        }

        if (todosArray.length === 0)
        {
            let li = document.createElement("li");
            li.innerHTML= "No to-do item to show.";
            ul.append(li);
        }

        // add handlers for click on the delete links
        ul.querySelectorAll("[data-delete]")
          .forEach((deleteLink) => {
                                       deleteLink.onclick = (event) => {
                                                                           event.preventDefault();
                                                                           let token = localStorage.getItem("token");

                                                                           fetch(`${API_URL}/todos/${event.target.getAttribute("data-delete")}`, 
                                                                                 { 
                                                                                     method: "DELETE",
                                                                                     mode: "cors",
                                                                                     headers: { "Authorization": "Bearer " + token },
                                                                                 }).then(() => {
                                                                                                   return this.fetchTodoItems();
                                                                                               }).then((items) => { this.updateTodoList(items); });
                                                                       }
                                   });


    }

    
    saveTodo(todoToSave)
    {
        let token = localStorage.getItem("token"); 

        return fetch(API_URL + "/todos", {
                                            method: "POST",
                                            mode: "cors",
                                            headers: { 
                                                         "Content-Type": "application/json",
                                                         "Authorization": "Bearer " + token 
                                                     },
                                            body: JSON.stringify({todo: todoToSave})
                                        });
    }
}


customElements.define("todo-list", TodoList)
