import React, { useState } from 'react';
import './AddCategory.css';
import { useDispatch } from 'react-redux';
import { addCategory, modifyCategory } from '../redux/actions/actions';
import { useLocation, useNavigate } from 'react-router-dom';
import adminApiUrl from '../adminApiUrl';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCategory = () => {
   const location = useLocation();
   const id = location?.state?.id || false;
   const [categoryName, setCategoryName] = useState(id ? location.state.categoryName.split(" kush ")[0] : '');
   const [subCategoryName, setSubCategoryName] = useState(id ? location.state.categoryName.split(" kush ")[1].split(" : ")[0] : '');
   const [catType, setCatType] = useState(id ? location.state.categoryName.split(" kush ")[1].split(" : ")[1] : '');
   const [number, setNumber] = useState(id ? location.state.number : 1);
   const [totalQuestions, setTotalQuestions] = useState(id ? location.state.totalQuestions : 0);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleSave = () => {
      // console.log('Category Name:', categoryName, typeof categoryName);
      // console.log('Selected Number:', number, typeof number);
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
               // console.log(data);
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
               console.log(data);
               dispatch(addCategory(data?.category));
               navigate("/category");
            })
            .catch((error) => {
               console.log(error);
            })
      }

   };

   return (
      <section className='add-category-page'>
         <div>
            <h1>{id ? "Edit" : "Add"} Category</h1>
            <div>
               <label>
                  Category Name:
                  <input
                     type="text"
                     value={categoryName}
                     onChange={(e) => setCategoryName(e.target.value)}
                     placeholder="Enter category name"
                  />
               </label>
            </div>
            <div>
               <label>
                  Sub Category Name:
                  <input
                     type="text"
                     value={subCategoryName}
                     onChange={(e) => setSubCategoryName(e.target.value)}
                     placeholder="Enter sub category name"
                  />
               </label>
            </div>
            <div>
               <label>
                  Type
                  <select value={catType} onChange={(e) => setCatType(e.target.value)}>
                     <option value="Demo">Demo</option>
                     <option value="Main">Main</option>

                  </select>
               </label>
            </div>
            <div>
               <label>
                  Structure Number:
                  <select value={number} onChange={(e) => setNumber(Number(e.target.value))}>
                     {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                           {num}
                        </option>
                     ))}
                  </select>
               </label>
            </div>
            <div>
               <label>
                  Total Questions:
                  <input
                     type="text"
                     value={totalQuestions}
                     onChange={(e) => setTotalQuestions(e.target.value)}
                     placeholder="Enter total no. of Questions"
                  />
               </label>
            </div>
            <button onClick={handleSave}>Save</button>
         </div>
      </section>
   );
};

export default AddCategory;