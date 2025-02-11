// eslint-disable-next-line
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import adminApiUrl from "../adminApiUrl";
import { deleteCategory, setCategory } from "../redux/actions/actions";
import { TbRefresh } from "react-icons/tb";
import { HiOutlineTrash } from "react-icons/hi";
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

const Category = () => {
   const categories = useSelector((state) => state.categories);
   const [contentRefresh, setContentRefresh] = useState(false);
   const recordsPerPage = 10;
   const totalPages = Math.ceil(categories.length / recordsPerPage);
   const [currentPage, setCurrentPage] = useState(totalPages ? 1 : 0);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const handleAddCategory = () => {
      navigate("./addcategory");
   };

   const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   // eslint-disable-next-line
   const handleGoToPage = (e) => {
      const pageNum = parseInt(e);
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
                  <span className="refreshBtn" onClick={() => {
                     setContentRefresh(true);
                     fetchCategories()
                  }}>
                     <TbRefresh className={contentRefresh ? 'spin2 refreshIcon' : 'refreshIcon'} />
                  </span>
                  <button onClick={handleAddCategory} className="actionBtn">Add Category</button>
               </span>
            </h1>
            <table className="table-container">
               <thead>
                  <tr>
                     <th className="center">S.No</th>
                     <th>Category</th>
                     <th>Sub Category</th>
                     <th>Type</th>
                     <th className="center">Structure Name</th>
                     <th className="center">Total Questions</th>
                     <th className="center">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {currentRecords.length > 0 ? (
                     currentRecords.map((category, index) => (
                        <tr key={index}>
                           <td className="center">{startIndex + index + 1}</td>
                           <td>{category.categoryName.split(" kush ")[0]}</td>
                           <td>{category.categoryName.split(" kush ")[1].split(" : ")[0]}</td>
                           <td>{category.categoryName.split(" kush ")[1].split(" : ")[1]}</td>
                           <td className="center">{category.structure}</td>
                           <td className="center">{category.totalQuestions}</td>
                           <td className="center">
                              {/* <FaEye className="action-icon" title="View" /> */}
                              <FiEdit3 className="action-icon edit" title="Edit" onClick={() => handleCategoryEdit(category._id, category.categoryName, category.structure, category.totalQuestions)} />
                              <HiOutlineTrash className="action-icon delete" title="Delete" onClick={() => handleCategoryDelete(category._id)} />
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
               <div className="paginationSubCont">
                  <span className="pageCount">{totalPages ? currentPage + "-" + totalPages : 0} of {totalPages}</span>
                  <div className="pagination-top">
                     <span>Page </span>
                     <select className="pageNavDrop" value={currentPage} name="pages" id="page" onChange={(e) => {
                        handleGoToPage(e.target.value)
                     }}
                        onKeyUp={(e) => e.key === 'Enter' && handleGoToPage()}
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
      </section >
   );
};

export default Category;