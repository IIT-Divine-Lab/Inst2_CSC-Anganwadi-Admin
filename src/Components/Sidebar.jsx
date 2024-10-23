import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PiStudentFill } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import { FaQuestionCircle } from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if(location.pathname === "/AddQuestions")
      setIsCollapsed(true);  
  }, [location.pathname]);

  const handleAddQuestionsClick = () => {
    setIsCollapsed(true); 
    navigate("/AddQuestions"); // Navigate to the Add Questions page
  };

  // Function to handle click on "Student Data"
  const handleStudentDataClick = () => {
    setIsCollapsed(false);
    navigate("/Student");
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="link-item" onClick={() => navigate("/")}>
        <GoHome className="icon" />
        {!isCollapsed && <span className="description">Home</span>}
      </div>
      <div className="link-item" onClick={handleStudentDataClick}>
        <PiStudentFill className="icon" />
        {!isCollapsed && <span className="description">Student Data</span>}
      </div>
      <div className="link-item" onClick={handleAddQuestionsClick}>
        <FaQuestionCircle className="icon" />
        {!isCollapsed && <span className="description">Add Questions</span>}
      </div>
      {/* You can add more link items here */}
    </div>
  );
};

export default Sidebar;
