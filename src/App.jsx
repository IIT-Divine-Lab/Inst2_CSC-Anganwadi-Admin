import React, { useEffect, useState } from "react";
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
import TimeTaken from "./Pages/TimeTaken";
import SelectGraph from "./Pages/SelectGraph";
import SelectPara from "./Pages/SelectPara";
import CreatedGraph2 from "./Pages/CreatedGraph2";


const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loggedin, setLoggedIn] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [savedDescription, setSavedDescription] = useState("");
  const [selectedGraph, setSelectedGraph] = useState("Line Graph");
  const [graphName, setGraphName] = useState("");
  const [Xaxis, setXAxis] = useState(null); // stores X parameter
  const [Yaxis, setYAxis] = useState(null); // store Y parameter
  const [Xlabel, setXlabel] = useState(null); // stores X label name
  const [Ylabel, setYlabel] = useState(null); // stores Y label name
  const [Zaxis, setZAxis] = useState(null); // stores parameter for pie & doughnut chart
  const [Zlabel, setZlabel] = useState(null); // stores label for pie & doughnut chart
  const [filters, setFilters] = useState([]); // Stores selected filters

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 1200 && loggedin && !isCollapsed) {
        setIsCollapsed(true);
      }
      else if (window.innerWidth > 1200 && loggedin) {
        setIsCollapsed(false);
      }
    })
    if (window.innerWidth <= 1200 && loggedin && !isCollapsed) {
      setIsCollapsed(true);
    }
    else if (window.innerWidth > 1200 && loggedin) {
      setIsCollapsed(false);
    }
  }, [loggedin, isCollapsed])

  return (
    <Router>

      {loggedin && <Sidebar setHidden={setHidden} hidden={hidden} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
      <div
        className="content"
        style={loggedin ?
          isCollapsed ?
            { marginLeft: "70px" }
            :
            hidden
              ?
              { marginLeft: "0px" }
              :
              { marginLeft: "190px" }
          :
          {}
        }
      >
        <Routes>
          <Route path="/" element={loggedin ? <Dashboard setHidden={setHidden} loggedIn={loggedin} /> : <Login loggedIn={loggedin} setLoggedIn={setLoggedIn} />} />

          <Route path="/graph-builder" element={<SelectGraph loggedIn={loggedin} selectedGraph={selectedGraph} setSelectedGraph={setSelectedGraph} setGraphName={setGraphName} setXAxis={setXAxis} setYAxis={setYAxis} setZAxis={setZAxis} setFilters={setFilters} />} />

          <Route path="/select-parameter" element={<SelectPara loggedIn={loggedin} selectedGraph={selectedGraph} setSelectedGraph={setSelectedGraph} graphName={graphName} isDuplicating={isDuplicating} setIsDuplicating={setIsDuplicating} description={savedDescription} setGraphName={setGraphName} Xaxis={Xaxis} setXAxis={setXAxis} Yaxis={Yaxis} setYAxis={setYAxis} Xlabel={Xlabel} setXlabel={setXlabel} isEditing={isEditing} setIsEditing={setIsEditing} Ylabel={Ylabel} setYlabel={setYlabel} Zaxis={Zaxis} setZAxis={setZAxis} Zlabel={Zlabel} setZlabel={setZlabel} filters={filters} setFilters={setFilters} />} />

          <Route path="/create-graph" element={<CreatedGraph2 selectedGraph={selectedGraph} setSelectedGraph={setSelectedGraph} savedDescription={savedDescription} setSavedDescription={setSavedDescription} graphName={graphName} isDuplicating={isDuplicating} setIsDuplicating={setIsDuplicating} setGraphName={setGraphName} Xaxis={Xaxis} isEditing={isEditing} setIsEditing={setIsEditing} setXAxis={setXAxis} Yaxis={Yaxis} setYAxis={setYAxis} Xlabel={Xlabel} setXlabel={setXlabel} Ylabel={Ylabel} setYlabel={setYlabel} filters={filters} setFilters={setFilters} />} />

          <Route path="/student" element={<StudentData loggedIn={loggedin} />} />

          <Route path="/questions" element={<Questions loggedIn={loggedin} />} />

          <Route path="/questions/addquestion" element={<AddQuestion loggedIn={loggedin} />} />

          <Route path="/questions/editquestion" element={<AddQuestion loggedIn={loggedin} />} />

          <Route path="/category" element={<Category loggedIn={loggedin} />} />

          <Route path="/category/addcategory" element={<AddCategoryPage loggedIn={loggedin} />} />

          <Route path="/category/editcategory" element={<AddCategoryPage loggedIn={loggedin} />} />

          <Route path="/result" element={<Result loggedIn={loggedin} />} />

          <Route path="/result/time" element={<TimeTaken loggedIn={loggedin} />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;