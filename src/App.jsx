import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import StudentData from "./Pages/Student"; // Adjust the path as necessary
import "./App.css";

const App = () => {
  return (
    <Router>
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/Student" element={<StudentData />} />
          {/* You can add more routes here as needed */}
          <Route path="/" element={<div>Welcome Home!</div>} /> {/* Example home route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;