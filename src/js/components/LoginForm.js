
const API_URL = "http://localhost:3000"


class LoginForm extends HTMLElement 
{
    constructor() 
    {
        super();

        this.innerHTML = ` <div class="form-container">

                               <input type="text" 
                                      id="login-username" 
                                      placeholder="Username">

                               <input type="password" 
                                      id="login-password" 
                                      placeholder="Password">
                               
                               <button id="login-btn">Login</button>

                               <p id="login-msg" style="font-weight: bold;"></p>

                           </div>
                         `;

        let btn = this.querySelector('#login-btn');
        let userInput = this.querySelector('#login-username');
        let passInput = this.querySelector('#login-password');
        let loginMsg = this.querySelector('#login-msg');

        btn.onclick = () => {
                                let username = userInput.value;
                                let password = passInput.value;

                                // Basic validation
                                if (!username || !password) 
                                {
                                    loginMsg.style.color = "red";
                                    loginMsg.textContent = "Please enter username and password!";
                                    return;
                                }

                                this.doLogin(username, password).then((res) => { 
                                                                                   if (res.status === 200) 
                                                                                   {
                                                                                       // Save the JWT token in the browser
                                                                                       res.json()
                                                                                          .then(data => localStorage.setItem("token", data.token));

                                                                                       loginMsg.style.color = "green";
                                                                                       loginMsg.textContent = "Login completed successfully! " +
                                                                                                              "Redirecting to your todo list...";
                                                                                       
                                                                                       setTimeout(() => { 
                                                                                                            history.pushState("", "", "/");
                                                                                                            window.dispatchEvent(new Event("popstate"));
                                                                                                        }, 
                                                                                                        2000);
                                                                                   } 
                                                                                   else 
                                                                                   {
                                                                                       loginMsg.style.color = "red";
                                                                                       loginMsg.textContent = "Invalid credentials.";
                                                                                   }
                                                                               })
                                                                 .catch((err) => { 
                                                                                     loginMsg.textContent = "Server connection error.";
                                                                                     loginMsg.style.color = "red";
                                                                                 });
                            };
    }


    async doLogin(username, password) 
    {
        let response = await fetch(API_URL + "/auth", {
                                                          method: "POST",
                                                          headers: { "Content-Type": "application/json" },
                                                          body: JSON.stringify({ username, password })
                                                      });
        return response; 
    }
}


customElements.define("login-form", LoginForm);
