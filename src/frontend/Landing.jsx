import { useState } from "react";



function Landing() {
  const [showLogin, setShowLogin] = useState(true);

  const handleButtonClick = (isLogin) => {
    setShowLogin(isLogin);
  };

  return (
  <section className ="LandingPage">
    <div>
      <button onClick = {() => handleButtonClick(true)}>Login</button>
      <button onClick = {() => handleButtonClick(false)}>Create account</button>
    </div>
    <div>
      {showLogin ? (
        <h2 id="login-heading">Login
          <div>
            <label htmlFor="userName">
              Username: 
              <input type="text" id="userName" placeholder="userName" required/>
            </label>
          </div>

          <div>
            <label htmlFor="Password">
              Password: 
              <input type="password" id="Password" placeholder="Password" required/>
            </label>
          </div>
            <span
            style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            Forgot Password?
           </span>
          <div>
            
          </div>
            <button id="login">Login Now</button>
        </h2>
      ):
      (
        <h2 id="register-heading">Signup
          <div>
            <label htmlFor="name">
              Username:
              <input type="text" id="name" placeholder="username" required/>
            </label>
          </div>
          <div>
            <label htmlFor="email">
              Email Address:
              <input type="email" id="email" placeholder="email" required/>
            </label>
          </div>
          <div>
            <label htmlFor="Rpassword">
              Password: 
              <input type="password" id="Rpassword" placeholder="Create password" required/>
            </label>
          </div>
          <div>
            <button id="create">Register Now</button>
          </div>

        </h2>
      )
      }
    </div>

  </section> 
  )
}

export default Landing;