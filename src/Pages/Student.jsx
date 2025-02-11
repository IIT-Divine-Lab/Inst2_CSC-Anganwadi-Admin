import React, { useCallback, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// import studentData from '../data/StudentData.json';
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import "./Student.css"
import { useDispatch, useSelector } from 'react-redux';
import { setStudents } from '../redux/actions/actions.js';
import axios from "axios";
import { apiUrl } from "../adminApiUrl.jsx";
import { TbRefresh } from "react-icons/tb";

const Student = () => {
   const dispatch = useDispatch();
   const students = useSelector((state) => (state.student));
   const [pageInput, setPageInput] = useState(1);
   const [contentRefresh, setContentRefresh] = useState(false);
   const recordsPerPage = 10;
   const totalPages = Math.ceil(students.length / recordsPerPage);
   const [currentPage, setCurrentPage] = useState(totalPages ? 1 : 0);

   const startIndex = (currentPage - 1) * recordsPerPage;
   const currentRecords = students.slice(startIndex, startIndex + recordsPerPage);

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
         console.log(str);
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
         console.log(worksheet);
         let sinCentre = str.split(" ");
         let centreName = "";
         for (let i = 0; i < sinCentre.length; i++) {
            centreName += sinCentre[i];
         }
         XLSX.utils.book_append_sheet(workbook, worksheet, centreName);
      }

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(dataBlob, 'StudentData.xlsx');
   };

   const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   const handleGoToPage = () => {
      const pageNum = parseInt(pageInput); // Use the input state
      if (pageNum >= 1 && pageNum <= totalPages) {
         setCurrentPage(pageNum);
      } else {
         toast.error("Invalid page number.");
      }
   };

   const fetchStudentData = useCallback(async () => {
      axios.get(apiUrl + "user")
         .then(({ data }) => {
            // console.log(data);
            if (data.message !== "No Data")
               dispatch(setStudents(data.students));
         })
         .catch(error => {
            console.error(error);
         })
         .finally(() => {
            setTimeout(() => {
               setContentRefresh(false);
            }, 3000);
         })
   }, [dispatch])

   useEffect(() => {
      if (students.length === 0)
         fetchStudentData()
   }, [fetchStudentData, students]);

   return (
      <section>
         <div className="banner">
            <h1>
               Student
               <span style={{ display: "flex", alignItems: "center" }}>
                  <span className="refreshBtn" onClick={() => {
                     setContentRefresh(true);
                     fetchStudentData()
                  }}>
                     <TbRefresh className={contentRefresh ? 'spin2 refreshIcon' : 'refreshIcon'} />
                  </span>
                  <button onClick={handleDownloadExcel} className=" actionBtn">Export</button>
               </span>
            </h1>

            <div className="pagination-top">
               <span>Go To </span>
               <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && handleGoToPage()}
               />
               <button onClick={handleGoToPage}>Go</button>
            </div>

            <table className="table-container">
               <thead>
                  <tr>
                     <th>S.No</th>
                     <th>Name</th>
                     <th>Roll No</th>
                     <th>Age Group</th>
                     <th>Anganwadi Centre</th>
                     <th>Assessment Submitted</th>
                  </tr>
               </thead>
               <tbody>
                  {currentRecords.length > 0 ? (
                     currentRecords.map((student, index) => (
                        <tr key={index}>
                           <td>{startIndex + index + 1}</td>
                           <td>{student.name}</td>
                           <td>{student.rollno}</td>
                           <td>{student.age}</td>
                           <td>{student.awcentre}</td>
                           <td>{student.assessId ? <TiTick className="tick" /> : <RxCross2 className="cross" />}</td>
                        </tr>
                     ))
                  ) : (
                     <tr><td colSpan="6">No Student Records Found!</td></tr>
                  )}
               </tbody>
            </table>

            <div className="pagination">
               <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="prev"
                  disabled={!totalPages || currentPage === 0 || (currentPage === 1 || totalPages === 1)}
               >
                  Previous
               </button>
               <span>Page {totalPages ? currentPage : 0} of {totalPages}</span>
               <button
                  className="next"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!totalPages || currentPage === totalPages}
               >
                  Next
               </button>
            </div>
         </div>
      </section>
   );
};
export default Student;