// eslint-disable-next-line
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PiStudent, PiStudentFill } from "react-icons/pi";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineDocumentReport, HiDocumentReport } from "react-icons/hi";
import { BsQuestionCircle, BsQuestionCircleFill } from "react-icons/bs";
import { MdCategory, MdOutlineCategory } from "react-icons/md";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
   const navigate = useNavigate();
   const location = useLocation();

   // useEffect(() => {
   //    if (location.pathname === "/questions/addquestion" || location.pathname === "/questions/editquestion") {
   //       setIsCollapsed(true);
   //    }
   // }, [location.pathname, setIsCollapsed]);

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
         <div className={location.pathname === "/" ? 'active link-item' : 'link-item'} onClick={() => navigate("/")}>
            {/* {location.pathname === "/" && <div className="active"></div>} */}
            {
               location.pathname === "/" ?
                  <>
                     <div className="appearLine">&nbsp;</div>
                     <GoHomeFill className="icon" />
                  </>
                  :
                  <>
                     <GoHome className="icon" />
                  </>
            }
            {!isCollapsed && <span className="description">Home</span>}
         </div>
         <div className={location.pathname === "/student" ? 'active link-item' : 'link-item'} onClick={handleStudentDataClick}>
            {/* {location.pathname === "/student" && (
               <div className="active"></div>
            )} */}
            {
               location.pathname === "/student" ?
                  <>
                     <div className="appearLine">&nbsp;</div>
                     <PiStudentFill className="icon" />
                  </>
                  :
                  <>
                     <PiStudent className="icon" />
                  </>
            }
            {!isCollapsed && <span className="description">Student</span>}
         </div>
         <div className={location.pathname === "/category" || location.pathname === "/category/addcategory" || location.pathname === "/category/editcategory" ? 'active link-item' : 'link-item'} onClick={handleCategoryClick}>
            {/* {location.pathname === "/category" && (
               <div className="active"></div>
            )} */}
            {
               location.pathname === "/category" || location.pathname === "/category/addcategory" || location.pathname === "/category/editcategory" ?
                  <>
                     <div className="appearLine">&nbsp;</div>
                     <MdCategory className="icon" />
                  </>
                  :
                  <>
                     <MdOutlineCategory className="icon" />
                  </>
            }
            {!isCollapsed && <span className="description">Category</span>}
         </div>
         <div className={location.pathname === "/questions" || location.pathname === "/questions/addquestion" || location.pathname === "/questions/editquestion" ? 'active link-item' : 'link-item'} onClick={handleQuestionsClick}>
            {/* {location.pathname === "/questions" && (
               <div className="active"></div>
            )} */}
            {
               location.pathname === "/questions" || location.pathname === "/questions/addquestion" || location.pathname === "/questions/editquestion" ?
                  <>
                     <div className="appearLine">&nbsp;</div>
                     <BsQuestionCircleFill className="icon" />
                  </>
                  :
                  <>
                     <BsQuestionCircle className="icon" />
                  </>
            }
            {!isCollapsed && <span className="description">Questions</span>}
         </div>
         <div className={location.pathname === "/result" ? 'active link-item' : 'link-item'} onClick={handleResultClick}>
            {location.pathname === "/result" && (
               <div className="active"></div>
            )}
            {
               location.pathname === "/result" ?
                  <>
                     <div className="appearLine">&nbsp;</div>
                     <HiDocumentReport className="icon" />
                  </>
                  :
                  <>
                     <HiOutlineDocumentReport className="icon" />
                  </>
            }
            {!isCollapsed && <span className="description">Result</span>}
         </div>
      </div>
   );
};

export default Sidebar;
