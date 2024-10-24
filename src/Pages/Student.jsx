import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import studentData from '../data/StudentData.json';
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import "./Student.css"
import {useDispatch, useSelector} from 'react-redux';
import {setStudents} from '../redux/actions/actions.js';

const Student = () => {
   const dispatch = useDispatch();
   const students = useSelector((state) => (state.student));
   const[currentPage,setCurrentPage] = useState(1);
   const[pageInput, setPageInput] = useState(1);
   const recordsPerPage = 10;
   const totalPages = Math.ceil(students.length / recordsPerPage);

   useEffect(() => {
      if(students.length === 0)
         dispatch(setStudents(studentData));
   }, [dispatch, students]);

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
         let centreName ="";
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

   const startIndex = (currentPage - 1) * recordsPerPage;
   const currentRecords = students.slice(startIndex, startIndex + recordsPerPage);

   return (
      <section>
         <div className="banner">
            <h1>
               Student Data
               <button onClick={handleDownloadExcel} className="download-btn">Export</button>
            </h1>

            <div className="pagination-top">
               <span>Go To </span>
               <input
                  type="number"
                  value={pageInput} // Use the renamed input state
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
                           <td>{student.assessmentId ? <TiTick className="tick" /> : <RxCross2 className="cross" />}</td>
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
                  disabled={currentPage === 1}
               >
                  Previous
               </button>
               <span>Page {currentPage} of {totalPages}</span>
               <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
               >
                  Next
               </button>
            </div>
         </div>
      </section>
   );
};
export default Student;