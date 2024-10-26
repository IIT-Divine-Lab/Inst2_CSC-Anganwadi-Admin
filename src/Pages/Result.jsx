import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import "./Result.css"

const Result = () => {
   const [pageInput, setPageInput] = useState(1);
   const [currentPage, setCurrentPage] = useState(1);

   const result = useSelector((state) => state?.questions || []);
   const recordsPerPage = 10;
   const totalPages = Math.ceil(result?.length / recordsPerPage) || 1;
   const startIndex = (currentPage - 1) * recordsPerPage;
   const currentRecords = result?.slice(startIndex, startIndex + recordsPerPage);

   const data = [
      {
         categoryName: "Task 1",
         totalQuestion: 6
      },
      {
         categoryName: "Task 2",
         totalQuestion: 4
      },
      {
         categoryName: "Task 3",
         totalQuestion: 5
      },
      {
         categoryName: "Task 4",
         totalQuestion: 3
      },
      {
         categoryName: "Task 5",
         totalQuestion: 8
      },
      {
         categoryName: "Task 6",
         totalQuestion: 4
      },
      {
         categoryName: "Task 7",
         totalQuestion: 3
      },
      {
         categoryName: "Task 8",
         totalQuestion: 5
      },
      {
         categoryName: "Task 9",
         totalQuestion: 5
      },
      {
         categoryName: "Task 10",
         totalQuestion: 5
      },
      {
         categoryName: "Task 11",
         totalQuestion: 5
      },
      {
         categoryName: "Task 12",
         totalQuestion: 5
      },
      {
         categoryName: "Task 13",
         totalQuestion: 5
      },
   ]

   const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   const handleGoToPage = () => {
      const pageNum = parseInt(pageInput);
      if (pageNum >= 1 && pageNum <= totalPages) {
         setCurrentPage(pageNum);
      } else {
         toast.error("Invalid page number.");
      }
   };

   return (
      <section>
         <div className="banner">
            <h1>Result</h1>
            <div className="pagination-top">
               <span>Go To</span>
               <input
                  type="number"
                  value={pageInput}
                  min={1}
                  max={totalPages}
                  onChange={(e) => setPageInput(e.target.value)}
               />
               <button onClick={handleGoToPage}>Go</button>
            </div>
            <div className='parentTableContainer'>
               <table className='table-container' style={{ width: `calc(500px * ` + (data.length + 1) + `)` }}>
                  <thead>
                     <tr>
                        <th rowSpan={2}>S. No</th>
                        <th rowSpan={2}>Name</th>
                        <th rowSpan={2}>Anganwadi Centre</th>
                        <th rowSpan={2}>Age Group</th>
                        {
                           data.map((headData, index) => {
                              return <th key={index} style={{ textAlign: "center" }} colSpan={headData.totalQuestion}>{headData.categoryName}</th>
                           })
                        }
                     </tr>
                     <tr>
                        {
                           data.flatMap((headData, index) => {
                              return Array.from({ length: headData.totalQuestion }, (_, i) => (
                                 <th style={{ textAlign: "center" }} key={`${index}-${i}`}>Trial {i + 1}</th>
                              ))
                           })
                        }
                     </tr>
                     <tr>
                        <td style={{ textAlign: "center" }}></td>
                        <td style={{ textAlign: "center" }}></td>
                        <td style={{ textAlign: "center" }}></td>
                        <td style={{ textAlign: "center" }}></td>
                        {
                           data.flatMap((headData, index) => {
                              return Array.from({ length: headData.totalQuestion }, (_, i) => (
                                 <td style={{ textAlign: "center" }} key={`${index}-${i}`}>Trial {i + 1}</td>
                              ))
                           })
                        }
                     </tr>
                  </thead>
               </table>
            </div>
         </div>
      </section>
   )
}

export default Result