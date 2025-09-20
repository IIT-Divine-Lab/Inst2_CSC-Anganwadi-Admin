import React, { useCallback, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import "./Student.css"
import { useDispatch, useSelector } from 'react-redux';
import { setStudents } from '../redux/actions/actions.js';
import axios from "axios";
import { apiUrl } from "../adminApiUrl.jsx";
import { TbRefresh } from "react-icons/tb";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FiClock } from "react-icons/fi";

const Student = ({ loggedIn }) => {
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const students = useSelector((state) => (state.student));
   const [contentRefresh, setContentRefresh] = useState(false);
   const recordsPerPage = 10;
   const totalPages = Math.ceil(students.length / recordsPerPage);
   const navigate = useNavigate();
   const [currentPage, setCurrentPage] = useState(totalPages ? 1 : 0);

   const startIndex = (currentPage - 1) * recordsPerPage;
   const currentRecords = students.slice(startIndex, startIndex + recordsPerPage);

   useEffect(() => {
      if (!loggedIn)
         navigate("/");
   }, [loggedIn, navigate])

   const handleDownloadExcel = () => {
      if (students.length === 0) {
         toast.error("No student data to download.");
         return;
      }
      toast.info("Exporting all student records - centre wise", {
         autoClose: 3000
      });

      var allCentre = [...new Set(students.map(item => item.awcentre))];
      let worksheet;

      const workbook = XLSX.utils.book_new();
      for (let i = 0; i < allCentre.length; i++) {
         let str = allCentre[i];
         let centre = [];
         for (let j = 0; j < students.length; j++) {
            if (students[j].awcentre === str) {
               centre.push(students[j]);
            }
         }
         worksheet = XLSX.utils.json_to_sheet(centre.map((student, index) => ({
            "S.No": index + 1,
            "Name": student.name,
            "Roll No": student.rollno,
            "Age Group": student.age,
            "Assessment Submitted": student.assessmentId ? '✔️' : '❌'
         })))
         const sinCentre = str.split(" - ");
         const centreName = sinCentre[0] + "-" + sinCentre[2] + "-" + sinCentre[4].split("led")[0]
         console.log(centreName)
         console.log(centreName.length);
         XLSX.utils.book_append_sheet(workbook, worksheet, centreName);
      }

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(dataBlob, 'StudentData.xlsx');
   };

   const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   const handleGoToPage = (value) => {
      const pageNum = parseInt(value); // Use the input state
      if (pageNum >= 1 && pageNum <= totalPages) {
         setCurrentPage(pageNum);
      } else {
         toast.error("Invalid page number.");
      }
   };

   const fetchStudentData = useCallback(async () => {
      axios.get(apiUrl + "user")
         .then(({ data }) => {
            if (data.message !== "No Data") {
               dispatch(setStudents(data.students));
               setCurrentPage(1);
               setLoading(false);
            }
         })
         .catch(error => {
            console.error(error);
         })
         .finally(() => {
            setContentRefresh(false);
            setLoading(false);
         })
   }, [dispatch])

   const getRequiredAWCDetail = (awc, field) => {
      const awcDetails = awc?.split(" - ");
      switch (field) {
         case "state": return awcDetails[0];
         case "district": return awcDetails[1];
         case "code": return awcDetails[2];
         case "block": return awcDetails[3];
         case "type": return awcDetails[4];
         default:
            break;

      }
   }

   function checkTime(student) {
      const assessmentTimeStamp = new Date(student);
      const currentTimeStamp = new Date();
      let status = true;

      if (currentTimeStamp.getFullYear() - assessmentTimeStamp.getFullYear() > 0) status = false;
      else if (currentTimeStamp.getMonth() - assessmentTimeStamp.getMonth() > 0) status = false;
      else if (currentTimeStamp.getDate() - assessmentTimeStamp.getDate() > 0) status = false;
      else if (currentTimeStamp.getHours() - assessmentTimeStamp.getHours() > 4) status = false;

      return status;
   }

   useEffect(() => {
      if (students.length === 0) {
         setLoading(true);
         fetchStudentData()
      }
   }, [fetchStudentData, students]);

   return (
      <section>
         <div className="banner w-fit">
            <h1>
               Student
               <span style={{ display: "flex", alignItems: "center" }}>
                  <span className="refreshBtn" onClick={() => {
                     setContentRefresh(true);
                     setLoading(true);
                     fetchStudentData()
                  }}>
                     <TbRefresh className={contentRefresh ? 'spin2 refreshIcon' : 'refreshIcon'} />
                  </span>
                  <button onClick={handleDownloadExcel} className=" actionBtn">Export</button>
               </span>
            </h1>

            <table className="table-container">
               <thead>
                  <tr>
                     <th>S.No</th>
                     <th>Name</th>
                     <th>Roll No</th>
                     <th>Age Group</th>
                     <th>State</th>
                     <th>District</th>
                     <th>Centre Code</th>
                     <th>Block</th>
                     <th>Anganwadi Type</th>
                     <th>Assessment Status</th>
                  </tr>
               </thead>
               <tbody>
                  {
                     loading ?
                        <tr>
                           <td colSpan={8}>
                              <div className="loadingContainer">
                                 <div></div>
                                 <div></div>
                                 <div></div>
                              </div>
                           </td>
                        </tr>
                        :
                        <>
                           {

                              currentRecords.length > 0 ? (
                                 currentRecords.map((student, index) => (
                                    <tr key={index}>
                                       <td>{startIndex + index + 1}</td>
                                       <td>{student.name}</td>
                                       <td>{student.rollno}</td>
                                       <td>{student.age}</td>
                                       <td>{getRequiredAWCDetail(student.awcentre, "state")}</td>
                                       <td>{getRequiredAWCDetail(student.awcentre, "district")}</td>
                                       <td>{getRequiredAWCDetail(student.awcentre, "code")}</td>
                                       <td>{getRequiredAWCDetail(student.awcentre, "block")}</td>
                                       <td>{getRequiredAWCDetail(student.awcentre, "type")}</td>
                                       {
                                          student.assessId ?
                                             <td style={{ color: "#007000", display: "flex", alignItems: "center" }}> <TiTick size={26} /> Submitted</td>
                                             :
                                             !student.assessmentStartTime ?
                                                <td>-</td>
                                                : checkTime(student.assessmentStartTime) ?
                                                   <td style={{ color: "#ebb105", display: "flex", alignItems: "center" }}> <FiClock size={20} style={{ paddingRight: "5px" }} /> In Progress</td>
                                                   :
                                                   <td style={{ color: "red", display: "flex", alignItems: "center" }}> <RxCross2 size={24} /> Aborted</td>
                                       }
                                    </tr>
                                 ))
                              ) : (
                                 <tr><td colSpan="6">No Student Records Found!</td></tr>
                              )}
                        </>
                  }
               </tbody>
            </table>

            <div className="pagination">
               <div className="paginationSubCont">
                  <span className="pageCount">{totalPages ? currentPage : 0} of {totalPages}</span>
                  <div className="pagination-top">
                     <span>Page </span>
                     <select className="pageNavDrop" value={currentPage} name="pages" id="page" onChange={(e) => {
                        handleGoToPage(e.target.value)
                     }}
                     >
                        {
                           Array(totalPages).fill(" ").map((_, index) => {
                              return <option key={index} value={index + 1}>{index + 1}</option>
                           })
                        }
                     </select>
                  </div>
                  <div className="movementIcons">

                     <MdOutlineKeyboardArrowLeft
                        className={(!totalPages || currentPage === 0 || (currentPage === 1 || totalPages === 1)) ? 'prev disabled' : 'prev'}
                        onClick={
                           () => {
                              if (!(!totalPages || currentPage === 0 || (currentPage === 1 || totalPages === 1)))
                                 handlePageChange(currentPage - 1)
                           }
                        }
                     />
                     <MdOutlineKeyboardArrowRight
                        className={(!totalPages || currentPage === totalPages) ? 'next disabled' : 'next'}
                        onClick={
                           () => {
                              if (!(!totalPages || currentPage === totalPages))
                                 handlePageChange(currentPage + 1)
                           }
                        }
                        disabled={!totalPages || currentPage === totalPages}
                     />
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};
export default Student;