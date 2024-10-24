import React, { useState } from 'react'
import "./AddQuestion.css"
import { useSelector } from 'react-redux'
import Structure1to4 from '../Components/Structure1-4';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import { FaSpinner, FaCheck } from "react-icons/fa6";


const AddQuestion = () => {
   const categories = [
      {
         categoryName: "Category2",
         structure: 2
      },
      {
         categoryName: "Category3",
         structure: 3
      },
      {
         categoryName: "Category5",
         structure: 5
      },
      {
         categoryName: "Category4",
         structure: 4
      },
      {
         categoryName: "Category1",
         structure: 1
      }
   ];
   // const categories = useSelector((state) => state.categories);

   const [quesCategory, setQuesCategory] = useState("Select question category");
   const [questionImageBefore, setQuestionImageBefore] = useState(undefined);
   const [questionText, setQuestionText] = useState("");
   const [questionImageAfter, setQuestionImageAfter] = useState(undefined);
   const [totalOptions, setTotalOptions] = useState(4);

   const struct = () => {
      let selectCategory = categories.filter((cat) => cat.categoryName === quesCategory);

      switch (selectCategory[0].structure) {
         case 1:
         case 2:
         case 3:
         case 4: return <Structure1to4
            structure={selectCategory[0].structure}
            questionImageBefore={questionImageBefore}
            questionText={questionText}
            questionImageAfter={questionImageAfter}
            totalOptions={totalOptions}
         />
         case 5: return <>Structure 5</>
         case 6: return <>Structure 6</>
         default: console.log("Error");
            break;
      }
   }

   const deleteFromUploadCare = (uuid) => {
      return fetch(`https://api.uploadcare.com/files/${uuid}/`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Uploadcare.Simple f0b48dbfeaff1298ebed:bc3d9f9926fcc6926aec'
         }
      })
   }

   const updateBeforeImage = (e) => {
      if (!e.allEntries.length) {
         let uuid = questionImageBefore.split("/");
         deleteFromUploadCare(uuid[uuid.length - 2])
            .then(() => {
               setQuestionImageBefore(undefined);
            })
            .catch((error) => {
               console.log(error);
            })
         return;
      }
      if (e.allEntries[0].isUploading) {
         setQuestionImageBefore(0);
         return;
      }
      setQuestionImageBefore(e.allEntries[0].cdnUrl);
   }

   const updateAfterImage = (e) => {
      if (!e.allEntries.length) {
         let uuid = questionImageAfter.split("/");
         deleteFromUploadCare(uuid[uuid.length - 2])
            .then(() => {
               setQuestionImageAfter(undefined);
            })
            .catch((error) => {
               console.log(error);
            })
         return;
      }
      if (e.allEntries[0].isUploading) {
         setQuestionImageAfter(0);
         return;
      }
      setQuestionImageAfter(e.allEntries[0].cdnUrl);
   }

   return (
      <div className='banner flex-jc'>
         <div className='banner w-45'>
            <div className='formFieldContainer'>
               <label className='fieldLabel'>Category</label>
               <select name="category" value={quesCategory} className='formField' onChange={(e) => setQuesCategory(e.target.value)} id="category">
                  {/* {
                     categories.map((category, index) => {
                        return <option key={index} value={category.categoryName}>{category.categoryName}</option>
                     })
                  } */}
                  <option value="Select question category">Select question category</option>
                  <option value="Category1">Category1</option>
                  <option value="Category2">Category2</option>
                  <option value="Category3">Category3</option>
                  <option value="Category4">Category4</option>
                  <option value="Category5">Category5</option>
               </select>
            </div>
            <hr />
            {
               quesCategory !== "Select question category" ? (
                  <>
                     {
                        quesCategory === "Category1" ?
                           <div className='formFieldContainer'>
                              <label className='fieldLabel'>Question Title Image</label>
                              <div className='customFileUploadContainer'>
                                 <FileUploaderRegular
                                    pubkey="f0b48dbfeaff1298ebed"
                                    maxLocalFileSizeBytes={1500000}
                                    multiple={false}
                                    imgOnly={true}
                                    sourceList="local, camera, gdrive, gphotos"
                                    useCloudImageEditor={false}
                                    classNameUploader="my-config uc-light"
                                    onChange={(e) => updateBeforeImage(e)}
                                 />
                                 {questionImageBefore !== undefined ?
                                    questionImageBefore === 0 ?
                                       <FaSpinner className='spin ml-12' />
                                       :
                                       <FaCheck className='ml-12' />
                                    :
                                    ""}
                              </div>
                           </div>
                           : ""
                     }
                     <div className='formFieldContainer'>
                        <label className='fieldLabel'>Question Text</label>
                        <input type="text" name="questionText" id="questionText" className='formField' value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
                     </div>
                     {
                        quesCategory === "Category1" || quesCategory === "Category 2" ?
                           <div className='formFieldContainer'>
                              <label className='fieldLabel'>Question Image</label>
                              <div className='customFileUploadContainer'>
                                 <FileUploaderRegular
                                    pubkey="f0b48dbfeaff1298ebed"
                                    maxLocalFileSizeBytes={1500000}
                                    multiple={false}
                                    imgOnly={true}
                                    sourceList="local, camera, gdrive, gphotos"
                                    useCloudImageEditor={false}
                                    classNameUploader="my-config uc-light"
                                    onChange={(e) => updateAfterImage(e)}
                                 />
                                 {questionImageAfter !== undefined ?
                                    questionImageAfter === 0 ?
                                       <FaSpinner className='spin' />
                                       :
                                       <FaCheck />
                                    :
                                    ""}
                              </div>
                           </div>
                           : ""
                     }
                     <div className="formFieldContainer">
                        <label className="fieldLabel"></label>
                        <select name="totalOptions" id="totalOptions" value={totalOptions} onChange={(e) => setTotalOptions(e.target.value)} className="formField">
                           <option value="2">2</option>
                           <option value="3">3</option>
                           <option value="4">4</option>
                        </select>
                     </div>
                  </>
               )
                  : ""

            }
         </div>
         <div className='banner w-45'>
            {
               quesCategory !== "Select question category" && struct()
            }
         </div>
      </div >
   )
}

export default AddQuestion