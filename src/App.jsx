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


const App = () => {
   const [isCollapsed, setIsCollapsed] = useState(false);
   return (
      <Router>
         <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
         <div
            className="content"
            style={isCollapsed ? { marginLeft: "110px" } : { marginLeft: "200px" }}
         >
            <Routes>
               <Route path="/" element={<div>Welcome Home!</div>} />
               <Route path="/student" element={<StudentData />} />
               <Route path="/questions" element={<Questions />} />
               <Route path="/questions/addquestion" element={<AddQuestion />} />
               <Route path="/questions/editquestion" element={<AddQuestion />} />
               <Route path="/category" element={<Category />} />
               <Route path="/category/addcategory" element={<AddCategoryPage />} />
               <Route path="/category/editcategory" element={<AddCategoryPage />} />
               <Route path="/result" element={<Result />} />
            </Routes>
         </div>
      </Router>
   );
};

export default App;