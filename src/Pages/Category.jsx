// eslint-disable-next-line
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import { FaEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import "./Category.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import adminApiUrl from "../adminApiUrl";
import { deleteCategory, setCategory } from "../redux/actions/actions";
import { TbRefresh } from "react-icons/tb";

const Category = () => {
   const categories = useSelector((state) => state.categories);
   const [currentPage, setCurrentPage] = useState(1);
   const [contentRefresh, setContentRefresh] = useState(false);
   const [pageInput, setPageInput] = useState(1);
   const recordsPerPage = 10;
   const totalPages = Math.ceil(categories.length / recordsPerPage);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const handleAddCategory = () => {
      navigate("./addcategory");
   };

   const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   // eslint-disable-next-line
   const handleGoToPage = () => {
      const pageNum = parseInt(pageInput);
      if (pageNum >= 1 && pageNum <= totalPages) {
         setCurrentPage(pageNum);
      } else {
         toast.error("Invalid page number.");
      }
   };

   const startIndex = (currentPage - 1) * recordsPerPage;
   const currentRecords = categories.slice(
      startIndex,
      startIndex + recordsPerPage
   );

   const fetchCategories = useCallback(async () => {
      axios.get(adminApiUrl + "category")
         .then((({ data }) => {
            if (data.message !== "No Data")
               dispatch(setCategory(data.categories));
         }))
         .catch((error) => {
            console.log(error);
         })
         .finally(() => {
            setTimeout(() => {
               setContentRefresh(false);
            }, 3000);
         })
   }, [dispatch])

   const handleCategoryEdit = (id, categoryName, number, totalQuestions) => {
      navigate("./editcategory", { state: { id, categoryName, number, totalQuestions } })
   }

   const handleCategoryDelete = (id) => {
      axios.delete(adminApiUrl + "category/" + id)
         .then(({ data }) => {
            dispatch(deleteCategory(data?.category))
         })
         .catch((error) => {
            console.error(error);
         })
   }

   useEffect(() => {
      if (categories.length === 0)
         fetchCategories();
   }, [categories, fetchCategories])

   return (
      <section className="dashboard page">
         <div className="banner">
            <h1>
               Category Data
               <span style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ border: "2px solid #333", marginRight: "12px", cursor: "pointer" }} onClick={() => {
                     setContentRefresh(true);
                     fetchCategories()
                  }}>
                     <TbRefresh style={{ padding: "5px" }} className={contentRefresh ? 'spin2' : ''} />
                  </span>
                  <button onClick={handleAddCategory} className="download-btn">Add Category</button>
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
                     <th>Category</th>
                     <th>Structure Name</th>
                     <th>Total Questions</th>
                     <th>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {currentRecords.length > 0 ? (
                     currentRecords.map((category, index) => (
                        <tr key={index}>
                           <td>{startIndex + index + 1}</td>
                           <td>{category.categoryName.includes("AAA") ? category.categoryName.split(": ")[0] + ": Demo" : category.categoryName}</td>
                           <td>{category.structure}</td>
                           <td>{category.totalQuestions}</td>
                           <td>
                              {/* <FaEye className="action-icon" title="View" /> */}
                              <CiEdit className="action-icon" title="Edit" onClick={() => handleCategoryEdit(category._id, category.categoryName, category.structure, category.totalQuestions)} />
                              <MdDelete className="action-icon" title="Delete" onClick={() => handleCategoryDelete(category._id)} />
                           </td>

                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan="5">No Category Records Found!</td>
                     </tr>
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
               <span>
                  Page {currentPage} of {totalPages}
               </span>
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

export default Category;