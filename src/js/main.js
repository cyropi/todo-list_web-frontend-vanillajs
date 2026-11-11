// --- COMPONENT IMPORTS (Side-effect: to register global Custom Elements) ---
import './components/TodoList.js';
import './components/LoginForm.js';
import './components/RegisterForm.js';

// --- VIEW IMPORTS ---
import homeView from './views/home.js';
import loginView from './views/login.js';
import registerView from './views/register.js';
import contactView from './views/contact.js';
import todoListView from './views/todoList.js';
import footerView from './views/footer.js';


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
                  "/" : { title: "Home", render: homeView, requiresAuth: false },
                  "/login" : { title: "Login", render: loginView, requiresAuth: false },
                  "/register" : { title: "Register", render: registerView, requiresAuth: false },
                  "/todo-list" : { title: "Todo List", render: todoListView, requiresAuth: true },
                  "/contact" : { title: "Contact", render: contactView, requiresAuth: false }
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


footer.innerHTML = footerView();


window.addEventListener("click", e =>
                                 {
                                    if (e.target.matches("[data-link]"))
                                    {
                                       e.preventDefault();
                                       history.pushState("", "", e.target.href);

                                       router();
                                    }
                                 });
window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);

