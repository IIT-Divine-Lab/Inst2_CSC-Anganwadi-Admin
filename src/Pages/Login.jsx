import React, { useState } from 'react'
import "./Login.css"
import { toast } from 'react-toastify';

const Login = ({ loggedIn, setLoggedIn }) => {
   const credential = {
      username: "IIT Delhi",
      password: "IitD@123"
   }

   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");

   const handleLogin = () => {
      if (username === credential.username && password === credential.password) {
         setLoggedIn(true);
      }
      else if (username === "" || password === "") {
         toast("Fill the username and password to proceed.", {
            autoClose: 1500,
            type: "warning"
         })
      }
      else {
         toast("Invalid Credentials", {
            autoClose: 1500,
            type: "error"
         })
      }
   }

   return (
      <div className='loginContainer'>
         <div className='banner '>
            <div>
               <div>
                  Please enter your details
               </div>
               <div>
                  Welcome
               </div>
            </div>
            <div>
               <div>
                  <input required type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='User Name' />
                  <input required type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
               </div>
            </div>
            <div>
               <button onClick={handleLogin} className='actionBtn'>Log In</button>
            </div>
         </div>
      </div>
   )
}

export default Login