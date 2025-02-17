import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ loggedIn }) => {
   const navigate = useNavigate();

   useEffect(() => {
      if (!loggedIn)
         navigate("/");
   }, [loggedIn, navigate])

   return (
      <div className='banner'>
         <h1>
            Welcome 👋
         </h1>
      </div>
   )
}

export default Dashboard