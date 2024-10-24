import React, { useState } from 'react'
import "./AddQuestion.css"
// eslint-disable-next-line
import { useSelector } from 'react-redux'
import Structure1to4 from '../Components/Structure1-4';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import { FaSpinner, FaCheck } from "react-icons/fa6";
import Button from '../Components/Common/Button';


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
   const [ageGroup, setAgeGroup] = useState("Select age group");
   const [questionImageBefore, setQuestionImageBefore] = useState(undefined);
   const [questionText, setQuestionText] = useState("");
   const [questionImageAfter, setQuestionImageAfter] = useState(undefined);
   const [workingStructure, setWorkingStructure] = useState(0);
   const [totalOptions, setTotalOptions] = useState("Choose");
   const [option, setOption] = useState();
   const [questionSound, setQuestionSound] = useState("");
   const [questionOnlyText, setQuestionOnlyText] = useState("");
   const [questionSoundText, setQuestionSoundText] = useState("");
   const [enabledSound, setEnabledSound] = useState(true);
   const [enabledText, setEnabledText] = useState(true);

   const struct = () => {
      let selectCategory = categories.filter((cat) => cat.categoryName === quesCategory);
      switch (selectCategory[0].structure) {
         case 1:
         case 2:
         case 3:
         case 4:
            return <Structure1to4
               structure={selectCategory[0].structure}
               questionImageBefore={questionImageBefore}
               questionText={questionText}
               questionImageAfter={questionImageAfter}
               totalOptions={totalOptions}
               option={option}
               enabledSound={enabledSound}
               enabledText={enabledText}
               questionSound={questionSound}
               questionOnlyText={questionOnlyText}
               questionSoundText={questionSoundText}
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

   const updateOptions = (opt = []) => {
      let option = {}
      for (let i = 0; i < opt.length; i++) {
         option["o" + (i + 1)] = opt[i].cdnUrl;
      }
      setOption(option);
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

   const updateQuestionSound = (e) => {
      if (!e.allEntries.length) {
         let uuid = questionSound.split("/");
         deleteFromUploadCare(uuid[uuid.length - 2])
            .then(() => {
               setQuestionSound(undefined);
            })
            .catch((error) => {
               console.log(error);
            })
         return;
      }
      if (e.allEntries[0].isUploading) {
         setQuestionSound(0);
         return;
      }
      setQuestionSound(e.allEntries[0].cdnUrl);
   }

   const handleQuestionSubmission = (e) => {
      let submission = {};
      console.log(submission);
   }

   return (
      <div className='banner flex-jc'>
         <div className='banner w-45'>
            <div className='formFieldContainer'>
               <label className='fieldLabel'>Category</label>
               <select name="category" value={quesCategory} className='formField' onChange={(e) => {
                  setQuesCategory(e.target.value);
                  setWorkingStructure(categories.filter((cat) => cat.categoryName === e.target.value)[0]?.structure);
               }} id="category">
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
                     <div className='formFieldContainer'>
                        <label className='fieldLabel'>Age Group</label>
                        <select name="ageGroup" value={ageGroup} className='formField' onChange={(e) => {
                           setAgeGroup(e.target.value);
                        }} id="ageGroup">
                           <option value="Select age group">Select age group</option>
                           <option value="3-4">3-4</option>
                           <option value="4-5">4-5</option>
                           <option value="5-6">5-6</option>
                           <option value="common">For all groups</option>
                        </select>
                     </div>
                     {
                        workingStructure === 1 ?
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
                        workingStructure === 4 ?
                           <>
                              <div>
                                 <label className='fieldLabel'>Audio</label>
                                 <input type="checkbox" name="audioText" id="audio" checked={enabledSound} onChange={() => { if (enabledText === false && enabledSound === true) { return; } setEnabledSound(!enabledSound); setQuestionSoundText(""); setQuestionOnlyText(""); }} />
                                 <label className='fieldLabel'>Text</label>
                                 <input type="checkbox" name="audioText" id="text" checked={enabledText} onChange={() => { if (enabledText === true && enabledSound === false) { return; } setEnabledText(!enabledText) }} />
                              </div>
                              {
                                 enabledText ?
                                    <div className='formFieldContainer'>
                                       <label className='fieldLabel'>Question {enabledSound || !enabledText ? "Sound" : "Sub"} Text</label>
                                       <input type="text" name="questionText" id="questionText" className='formField' value={enabledSound || !enabledText ? questionSoundText : questionOnlyText} onChange={(e) => { enabledSound || !enabledText ? setQuestionSoundText(e.target.value) : setQuestionOnlyText(e.target.value) }} />
                                    </div>
                                    : ""
                              }
                           </>
                           :
                           ""
                     }
                     {
                        workingStructure === 1 || workingStructure === 2 ?
                           <div className='formFieldContainer'>
                              <label className='fieldLabel'>Question Image</label>
                              <div className='customFileUploadContainer'>
                                 <FileUploaderRegular
                                    pubkey="f0b48dbfeaff1298ebed"
                                    maxLocalFileSizeBytes={1500000}
                                    multiple={false}
                                    imgOnly={true}
                                    confirmUpload={true}
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
                           : workingStructure === 4 && enabledSound ?
                              <div className='formFieldContainer'>
                                 <label className='fieldLabel'>Audio</label>
                                 <div className='customFileUploadContainer'>
                                    <FileUploaderRegular
                                       pubkey="f0b48dbfeaff1298ebed"
                                       maxLocalFileSizeBytes={5000000}
                                       multiple={false}
                                       confirmUpload={true}
                                       sourceList="local, url, gdrive"
                                       useCloudImageEditor={false}
                                       classNameUploader="my-config uc-light"
                                       onChange={(e) => updateQuestionSound(e)}
                                    />
                                 </div>
                              </div>
                              : ""
                     }
                     <div className="formFieldContainer">
                        <label className="fieldLabel">Select Total Options</label>
                        <select name="totalOptions" disabled={option !== undefined ? true : false} id="totalOptions" value={totalOptions} onChange={(e) => setTotalOptions(e.target.value)} className="formField">
                           <option value="Choose">Select Total Options</option>
                           {
                              workingStructure !== 5 ?
                                 <>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                 </>
                                 :
                                 <>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                 </>
                           }
                        </select>
                     </div>
                     <div className='formFieldContainer'>
                        <label className='fieldLabel'> {totalOptions !== "Choose" ? "Select " + totalOptions + " photos as options" : ""}</label>
                        <div className='customFileUploadContainer'>
                           <FileUploaderRegular
                              pubkey="f0b48dbfeaff1298ebed"
                              maxLocalFileSizeBytes={1500000}
                              multipleMax={totalOptions}
                              multipleMin={totalOptions}
                              imgOnly={true}
                              confirmUpload={true}
                              sourceList="local, camera, gdrive, gphotos"
                              useCloudImageEditor={false}
                              classNameUploader="my-config uc-light"
                              onChange={(e) => updateOptions(e.allEntries)}
                           />
                        </div>
                     </div>

                     {/* Submit Button */}
                     <div className='formFieldContainer' onClick={handleQuestionSubmission} style={{ width: "max-content", marginTop: "40px" }}>
                        <Button form="true">Save Question</Button>
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