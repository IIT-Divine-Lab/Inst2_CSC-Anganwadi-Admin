import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@uploadcare/react-uploader/core.css"
import Sidebar from "./Components/Sidebar";
import StudentData from "./Pages/Student"; // Adjust the path as necessary
import "./App.css";
import AddCategoryPage from "./Pages/AddCategory";
import Category from "./Pages/Category";
import AddQuestion from "./Pages/AddQuestion";
import Questions from "./Pages/Questions";
import Result from "./Pages/Result";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";


const App = () => {
   const [isCollapsed, setIsCollapsed] = useState(false);
   const [loggedin, setLoggedIn] = useState(false);
   return (
      <Router>

         {loggedin && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
         <div
            className="content"
            style={loggedin ? isCollapsed ? { marginLeft: "110px" } : { marginLeft: "200px" } : {}}
         >
            <Routes>
               <Route path="/" element={loggedin ? <Dashboard loggedIn={loggedin} /> : <Login loggedIn={loggedin} setLoggedIn={setLoggedIn} />} />
               <Route path="/student" element={<StudentData loggedIn={loggedin} />} />
               <Route path="/questions" element={<Questions loggedIn={loggedin} />} />
               <Route path="/questions/addquestion" element={<AddQuestion loggedIn={loggedin} />} />
               <Route path="/questions/editquestion" element={<AddQuestion loggedIn={loggedin} />} />
               <Route path="/category" element={<Category loggedIn={loggedin} />} />
               <Route path="/category/addcategory" element={<AddCategoryPage loggedIn={loggedin} />} />
               <Route path="/category/editcategory" element={<AddCategoryPage loggedIn={loggedin} />} />
               <Route path="/result" element={<Result loggedIn={loggedin} />} />
            </Routes>
         </div>
      </Router>
   );
};

export default App;