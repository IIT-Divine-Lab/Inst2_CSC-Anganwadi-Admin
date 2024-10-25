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

const Category = () => {
   const categories = useSelector((state) => state.categories);
   const [currentPage, setCurrentPage] = useState(1);
   // eslint-disable-next-line
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
            dispatch(setCategory(data.categories));
         }))
         .catch((error) => {
            console.log(error);
         })
   }, [dispatch])

   const handleCategoryEdit = (id, categoryName, number) => {
      navigate("./editcategory", { state: { id, categoryName, number } })
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
               <button onClick={handleAddCategory} className="add-category-btn">
                  Add Category
               </button>
            </h1>

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
                           <td>{category.categoryName}</td>
                           <td>{category.structure}</td>
                           <td>{category.totalQuestions}</td>
                           <td>
                              {/* <FaEye className="action-icon" title="View" /> */}
                              <CiEdit className="action-icon" title="Edit" onClick={() => handleCategoryEdit(category._id, category.categoryName, category.structure)} />
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