import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PiStudentFill } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import { FaQuestionCircle } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/AddQuestions") {
      setIsCollapsed(true);
    }
  }, [location.pathname]);

  const handleAddQuestionsClick = () => {
    setIsCollapsed(true);
    navigate("/AddQuestions");
  };

  const handleStudentDataClick = () => {
    setIsCollapsed(false);
    navigate("/Student");
  };

  const handleCategoryClick = () => {
    setIsCollapsed(false);
    navigate("/Category");
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="link-item" onClick={() => navigate("/")}>
        {location.pathname === "/" && <div className="active-indicator"></div>}
        <GoHome className="icon" />
        {!isCollapsed && <span className="description">Home</span>}
      </div>
      <div className="link-item" onClick={handleStudentDataClick}>
        {location.pathname === "/Student" && (
          <div className="active-indicator"></div>
        )}
        <PiStudentFill className="icon" />
        {!isCollapsed && <span className="description">Student Data</span>}
      </div>
      <div className="link-item" onClick={handleAddQuestionsClick}>
        {location.pathname === "/AddQuestions" && (
          <div className="active-indicator"></div>
        )}
        <FaQuestionCircle className="icon" />
        {!isCollapsed && <span className="description">Add Questions</span>}
      </div>
      <div className="link-item" onClick={handleCategoryClick}>
        {location.pathname === "/Category" && (
          <div className="active-indicator"></div>
        )}
        <MdOutlineCategory className="icon" />
        {!isCollapsed && <span className="description">Category</span>}
      </div>
    </div>
  );
};

export default Sidebar;
