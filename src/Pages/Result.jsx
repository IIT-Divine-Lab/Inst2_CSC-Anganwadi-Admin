// // eslint-disable-next-line
// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { FaEye } from "react-icons/fa";
// import { CiEdit } from "react-icons/ci";
// import { MdDelete } from "react-icons/md";
// import "./Result.css";
// import { useSelector } from "react-redux";

// const Result = () => {
//   const results = useSelector((state) => state.results);
//   const [currentPage, setCurrentPage] = useState(1);
//   // eslint-disable-next-line
//   const [pageInput, setPageInput] = useState(1);
//   const recordsPerPage = 10;
//   const totalPages = Math.ceil(results.length / recordsPerPage);
//   const navigate = useNavigate();

//   const handleAddResult = () => {
//     navigate("./AddResult");
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // eslint-disable-next-line
//   const handleGoToPage = () => {
//     const pageNum = parseInt(pageInput);
//     if (pageNum >= 1 && pageNum <= totalPages) {
//       setCurrentPage(pageNum);
//     } else {
//       toast.error("Invalid page number.");
//     }
//   };

//   const startIndex = (currentPage - 1) * recordsPerPage;
//   const currentRecords = results.slice(startIndex, startIndex + recordsPerPage);

//   return (
//     <section className="dashboard page">
//       <div className="banner">
//         <h1>
//           Result Data
//           <button onClick={handleAddResult} className="add-category-btn">
//             Add Result
//           </button>
//         </h1>

//         <table className="table-container">
//           <thead>
//             <tr>
//               <th>S.No</th>
//               <th>Result</th>
//               <th>Structure Name</th>
//               <th>Total Questions</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentRecords.length > 0 ? (
//               currentRecords.map(
//                 (
//                   result,
//                   index
//                 ) => (
//                   <tr key={index}>
//                     <td>{startIndex + index + 1}</td>
//                     <td>{result.resultName}</td>{" "}
//                     <td>{result.structureName}</td>
//                     <td>{result.totalQuestions}</td>
//                     <td>
//                       <FaEye className="action-icon" title="View" />
//                       <CiEdit className="action-icon" title="Edit" />
//                       <MdDelete className="action-icon" title="Delete" />
//                     </td>
//                   </tr>
//                 )
//               )
//             ) : (
//               <tr>
//                 <td colSpan="5">No Result Records Found!</td>{" "}
//               </tr>
//             )}
//           </tbody>
//         </table>

//         <div className="pagination">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Result;
