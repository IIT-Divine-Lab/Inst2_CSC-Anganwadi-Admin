import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PiStudentFill } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import { FaQuestionCircle } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { MdOutlineCategory } from "react-icons/md";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      if (location.pathname === "/questions/addquestion") {
         setIsCollapsed(true);
      }
   }, [location.pathname, setIsCollapsed]);

   const handleQuestionsClick = () => {
      setIsCollapsed(false);
      navigate("/questions");
   };

   const handleStudentDataClick = () => {
      setIsCollapsed(false);
      navigate("/student");
   };

   const handleCategoryClick = () => {
      setIsCollapsed(false);
      navigate("/category");
   };

   const handleResultClick = () => {
      setIsCollapsed(false);
      navigate("/result");
   };

   return (
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
         <div className="link-item" onClick={() => navigate("/")}>
            {location.pathname === "/" && <div className="active"></div>}
            <GoHome className="icon" />
            {!isCollapsed && <span className="description">Home</span>}
         </div>
         <div className="link-item" onClick={handleStudentDataClick}>
            {location.pathname === "/student" && (
               <div className="active"></div>
            )}
            <PiStudentFill className="icon" />
            {!isCollapsed && <span className="description">Student Data</span>}
         </div>
         <div className="link-item" onClick={handleCategoryClick}>
            {location.pathname === "/category" && (
               <div className="active"></div>
            )}
            <MdOutlineCategory className="icon" />
            {!isCollapsed && <span className="description">Category</span>}
         </div>
         <div className="link-item" onClick={handleQuestionsClick}>
            {location.pathname === "/questions" && (
               <div className="active"></div>
            )}
            <FaQuestionCircle className="icon" />
            {!isCollapsed && <span className="description">Questions</span>}
         </div>
         <div className="link-item" onClick={handleResultClick}>
            {location.pathname === "/result" && (
               <div className="active"></div>
            )}
            <TbReportAnalytics className="icon" />
            {!isCollapsed && <span className="description">Result</span>}
         </div>
      </div>
   );
};

export default Sidebar;
