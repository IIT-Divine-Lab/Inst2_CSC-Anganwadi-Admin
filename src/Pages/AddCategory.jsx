import React, { useEffect, useState } from 'react';
import './AddCategory.css';
import { useDispatch } from 'react-redux';
import { addCategory, modifyCategory } from '../redux/actions/actions';
import { useLocation, useNavigate } from 'react-router-dom';
import adminApiUrl from '../adminApiUrl';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCategory = ({ loggedIn }) => {
   const location = useLocation();
   const id = location?.state?.id || false;
   const [categoryName, setCategoryName] = useState(id ? location.state.categoryName.split(" kush ")[0] : '');
   const [subCategoryName, setSubCategoryName] = useState(id ? location.state.categoryName.split(" kush ")[1].split(" : ")[0] : '');
   const [catType, setCatType] = useState(id ? location.state.categoryName.split(" kush ")[1].split(" : ")[1] : '');
   const [number, setNumber] = useState(id ? location.state.number : 1);
   const [totalQuestions, setTotalQuestions] = useState(id ? location.state.totalQuestions : 0);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   useEffect(() => {
      if (!loggedIn)
         navigate("/");
   }, [loggedIn, navigate])

   const handleSave = () => {
      let category = {
         categoryName: categoryName + " kush " + subCategoryName + " : " + catType,
         structure: number,
         totalQuestions: totalQuestions
      }
      if (id) {
         if (categoryName + " kush " + subCategoryName + " : " + catType === location.state.categoryName && number === location.state.number && totalQuestions === location.state.totalQuestions) {
            toast.info("No Changes Found", {
               autoClose: 2000
            })
            return;
         }
         axios.put(adminApiUrl + "category/" + id, category)
            .then(({ data }) => {
               dispatch(modifyCategory(data?.category));
               navigate("/category");
            })
            .catch((error) => {
               console.log(error);
            })
      }
      else {
         axios.post(adminApiUrl + "category", category)
            .then(({ data }) => {
               dispatch(addCategory(data?.category));
               navigate("/category");
            })
            .catch((error) => {
               console.log(error);
            })
      }

   };

   return (
      <>
         <div className='banner add-category-page'>
            <h1>
               Category Data / {id ? "Edit" : "Add"} Category
            </h1>
            <div>
               <label>
                  Category Name:
               </label>
               <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
               />
            </div>
            <div>
               <label>
                  Sub Category Name:
               </label>
               <input
                  type="text"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  placeholder="Enter sub category name"
               />
            </div>
            <div>
               <label>
                  Type
               </label>
               <select value={catType} onChange={(e) => setCatType(e.target.value)}>
                  <option value="Demo">Demo</option>
                  <option value="Main">Main</option>

               </select>
            </div>
            <div>
               <label>
                  Structure Number:
               </label>
               <select value={number} onChange={(e) => setNumber(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                     <option key={num} value={num}>
                        {num}
                     </option>
                  ))}
               </select>
            </div>
            <div>
               <label>
                  Total Questions:
               </label>
               <input
                  type="text"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(e.target.value)}
                  placeholder="Enter total no. of Questions"
               />
            </div>
            <button style={{ fontSize: "14px", width: "unset" }} className='actionBtn' onClick={handleSave}>Save Category</button>
         </div>
      </>
   );
};

export default AddCategory;