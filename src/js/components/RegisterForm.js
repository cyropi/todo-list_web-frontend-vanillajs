
const API_URL = "http://localhost:3000"


class RegisterForm extends HTMLElement 
{
    constructor() 
    {
        super();

        this.innerHTML = ` <div class="form-container">

                               <input type="text" 
                                      id="reg-username" 
                                      placeholder="Username">
                               
                               <input type="password" 
                                      id="reg-password" 
                                      placeholder="Password">
                               
                               <button id="reg-btn">Sign Up</button>
                              
                               <p id="reg-msg" style="font-weight: bold;"></p>

                            </div>
                         `;

        let btn = this.querySelector('#reg-btn');
        let userInput = this.querySelector('#reg-username');
        let passInput = this.querySelector('#reg-password');
        let msg = this.querySelector('#reg-msg');

        btn.onclick = async () => {
                                      let username = userInput.value;
                                      let password = passInput.value;

                                      // Basic validation
                                      if (!username || !password) 
                                      {
                                          msg.style.color = "red";
                                          msg.textContent = "Please enter username and password!";
                                          return;
                                      }

                                      try 
                                      {
                                          let response = await this.doSignup(username, password);
                                          
                                          if (response.status === 201) 
                                          {
                                              msg.style.color = "green";
                                              msg.textContent = "Signup completed successfully! " +
                                                                "Redirecting to login page...";
                                              
                                              setTimeout(() => {
                                                                   history.pushState("", "", "/login");
                                                                   window.dispatchEvent(new Event("popstate"));
                                                               }, 
                                                               2500);
                                          } 
                                          else 
                                          {
                                              msg.style.color = "red";
                                              msg.textContent = "Signup failed. Username may already be taken.";}
                                      } 
                                      catch (error) 
                                      {
                                          msg.style.color = "red";
                                          msg.textContent = "Server connection error."; 
                                      }
        };
    }


    async doSignup(username, password) 
    {
        let response = await fetch(API_URL + "/signup", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ username, password })
                                                        });
        return response; 
    }
}


customElements.define("register-form", RegisterForm);
