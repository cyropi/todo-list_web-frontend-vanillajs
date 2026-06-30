
export default () => {
                         const urlParams = new URLSearchParams(window.location.search);
                         const hasError = urlParams.get("error");

                         const bannerHTML = hasError 
                                          ? ` <div style="background-color: #ffcccc; 
                                                          color: #cc0000; 
                                                          padding: 10px; 
                                                          margin-bottom: 15px; 
                                                          border-radius: 5px; 
                                                          text-align: center;">
                                                  <b>Access Denied!</b> 
                                                  Please login to view this page.
                                              </div>`
                                          : '';

                        return ` ${bannerHTML}
                                <login-form></login-form>
                               `;
                     }
