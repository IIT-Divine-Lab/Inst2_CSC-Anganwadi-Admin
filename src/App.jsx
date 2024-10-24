import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import StudentData from "./Pages/Student"; // Adjust the path as necessary
import "./App.css";
import AddCategoryPage from "./Pages/AddCategory";

const App = () => {
  return (
    <Router>
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/Student" element={<StudentData />} />
          <Route path="/" element={<div>Welcome Home!</div>} />
          <Route path="/Category/AddCategory" element={<AddCategoryPage/>} />
          {/* <Route path="/Category" element={<AddCategoryPage/>} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;