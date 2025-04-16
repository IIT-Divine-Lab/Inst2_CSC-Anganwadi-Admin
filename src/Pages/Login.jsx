import React, { useState } from 'react'
import "./Login.css"
import { toast } from 'react-toastify';
import background from "../data/images/loginBackground.png"
import csclogo from "../data/images/CSClogo.png"
import iitlogo from "../data/images/IITlogo.png"

const Login = ({ loggedIn, setLoggedIn }) => {
  const credential = {
    username: "IIT Delhi",
    password: "IITd@123"
  }

  const [username, setUsername] = useState(credential.username);
  const [password, setPassword] = useState(credential.password);
  const [viewPassword, setViewPassword] = useState(false);

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
      <div className="loginLeftContainer" style={{ backgroundImage: `url(${background})` }}></div>
      <div className="loginRightContainer">
        <div className='headerIconContainer'>
          <div>
            <img src={csclogo} alt="" />
            <img src={iitlogo} alt="" />
          </div>
        </div>
        <div className='loginFormContainer util-flex-col'>
          <div className='util-flex-col'>
            <p>Welcome</p>
            <p>Please enter your details</p>
          </div>
          <div className='util-flex-col'>
            <input className='border border-gray-300 rounded' required type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='User Name' />
            <div className='customInput'>
              <input required className='border border-gray-300 rounded' type={viewPassword ? "text" : "password"} name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
              <div className='' onClick={() => setViewPassword(!viewPassword)}>
                i
              </div>
            </div>
          </div>
          <div className='util-flex-col'>
            <button onClick={handleLogin} className='actionBtn customLoginBtn'>Log In</button>
          </div>
        </div>
      </div>
      {/* <div className='banner '>
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
               </div>
            </div>
            <div>
            </div>
         </div> */}
    </div>
  )
}

export default Login