
// --- COMPONENT IMPORTS (Side-effect: to register Custom Elements) ---
import './components/TodoList.js';
import './components/LoginForm.js';
import './components/RegisterForm.js';

// --- VIEW IMPORTS ---
import home from './views/home.js';
import login from './views/login.js';
import register from './views/register.js';
import contact from './views/contact.js';
import todoList from './views/todoList.js';
import renderFooter from './views/footer.js';


let nav = document.createElement("nav");
nav.id = "nav";

let content = document.createElement("main");
content.id = "content";

let footer = document.createElement("footer");
footer.id = "footer";


let app = document.getElementById("app");
app.append(nav, content, footer);


// --- ROUTE DEFINITIONS ---
// with "requiresAuth" flag to protect private routes
const routes = {
                   "/" : { title: "Home", render: home, requiresAuth: false },
                   "/login" : { title: "Login", render: login, requiresAuth: false },
                   "/register" : { title: "Register", render: register, requiresAuth: false },
                   "/todo-list" : { title: "Todo List", render: todoList, requiresAuth: true },
                   "/contact" : { title: "Contact", render: contact, requiresAuth: false }
               };


function router()
{
    let view = routes[location.pathname];

    if (view)
    {
        if (view.requiresAuth) // --- UX ROUTE GUARD ---
        {
            let token = localStorage.getItem("token");

            if (!token)
            {
                // Redirect and append query string for the error banner
                history.replaceState("", "", "/login?error=unauthorized"); 
                router();
                return; 
            }
        }

        document.title = view.title;
        content.innerHTML = view.render();
    }
    else 
    {
        history.replaceState("", "", "/");
        router();
    }
}


for (let route in routes)
{
    let link = document.createElement("a");

    link.href = route;
    link.innerText = routes[route].title;
    link.setAttribute("data-link", "");

    nav.append(link);
}


footer.innerHTML = renderFooter();


window.addEventListener("click", e => { 
                                          if (e.target.matches("[data-link]"))
                                          {
                                              e.preventDefault();
                                              history.pushState("", "", e.target.href);
                                              router();
                                          }
                                      });
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);
