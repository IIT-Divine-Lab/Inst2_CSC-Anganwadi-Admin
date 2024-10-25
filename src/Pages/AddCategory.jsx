import React, { useState } from 'react';
import './AddCategory.css';
import { useDispatch } from 'react-redux';
import { addCategory } from '../redux/actions/actions';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
   const [categoryName, setCategoryName] = useState('');
   const [number, setNumber] = useState(1);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleSave = () => {
      console.log('Category Name:', categoryName);
      console.log('Selected Number:', number);
      let category = {
         categoryName,
         structureName: ` ${number}`, 
      }

      dispatch(addCategory(category));

      setCategoryName('');
      setNumber(1);
      navigate("/Category");
   };

   return (
      <section className='add-category-page'>
         <div>
            <h1>Add Category</h1>
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
                  Structure Number:
                  <select value={number} onChange={(e) => setNumber(Number(e.target.value))}>
                     {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                           {num}
                        </option>
                     ))}
                  </select>
               </label>
            </div>
            <button onClick={handleSave}>Save</button>
         </div>
      </section>
   );
};

export default AddCategory;