import React, { useCallback, useEffect, useState } from 'react'
import "./AddQuestion.css"
// eslint-disable-next-line
import { useDispatch, useSelector } from 'react-redux'
import Structure1to4 from '../Components/Structure1-4';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import { FaSpinner, FaCheck } from "react-icons/fa6";
import Button from '../Components/Common/Button';
import { toast } from 'react-toastify';
// eslint-disable-next-line
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminApiUrl, { apiUrl } from '../adminApiUrl';
import { addQuestion, setCategory } from '../redux/actions/actions';
import Structure5 from '../Components/Structure5';
import Select from 'react-select';
import Structure6 from '../Components/Structure6';


const AddQuestion = () => {
   const categories = useSelector((state) => state.categories);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   // const location = useLocation();
   // const id = location?.state?.id || undefined;
   // const [existingData, setExistingData] = useState({});
   const [quesCategory, setQuesCategory] = useState("Select question category");
   const [ageGroup, setAgeGroup] = useState("Select age group");
   const [questionImageBefore, setQuestionImageBefore] = useState(undefined);
   const [questionText, setQuestionText] = useState("");
   const [questionImageAfter, setQuestionImageAfter] = useState(undefined);
   const [workingStructure, setWorkingStructure] = useState(0);
   const [totalOptions, setTotalOptions] = useState(0);
   const [multiCorrectAnswer, setMultiCorrectAnswer] = useState([]);
   const [correctAnswer, setCorrectAnswer] = useState("-");
   const [option, setOption] = useState();
   const [questionSound, setQuestionSound] = useState("");
   const [questionOnlyText, setQuestionOnlyText] = useState("");
   const [questionSoundText, setQuestionSoundText] = useState("");
   const [enabledSound, setEnabledSound] = useState(true);
   const [enabledText, setEnabledText] = useState(true);
   const [answerImage, setAnswerImage] = useState(undefined);
   const [activeAnswerImage, setActiveAnswerImage] = useState(undefined);
   const [inactiveAnswerImage, setInactiveAnswerImage] = useState(undefined);

   const struct = () => {
      let selectCategory = categories.filter((cat) => cat._id === quesCategory);
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
               totalOptions={totalOptions || 10}
               option={option}
               enabledSound={enabledSound}
               enabledText={enabledText}
               questionSound={questionSound}
               questionOnlyText={questionOnlyText}
               questionSoundText={questionSoundText}
            />
         case 5: return <Structure5
            questionText={questionText}
            options={option}
            totalOptions={totalOptions}
            selected={multiCorrectAnswer}
            handleSelection={handleSelection}
         />
         case 6: return <Structure6
            questionText={questionText}
            questionImageAfter={questionImageAfter}
            activeOption={correctAnswer}
            answerImage={answerImage}
            active={activeAnswerImage}
            inactive={inactiveAnswerImage}
         />
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
   const updateAnswerImage = (e) => {
      if (!e.allEntries.length) {
         let uuid = answerImage.split("/");
         deleteFromUploadCare(uuid[uuid.length - 2])
            .then(() => {
               setAnswerImage(undefined);
            })
            .catch((error) => {
               console.log(error);
            })
         return;
      }
      if (e.allEntries[0].isUploading) {
         setAnswerImage(0);
         return;
      }
      setAnswerImage(e.allEntries[0].cdnUrl);
   }

   const updateActiveAnswerImage = (e) => {
      if (!e.allEntries.length) {
         let uuid = activeAnswerImage.split("/");
         deleteFromUploadCare(uuid[uuid.length - 2])
            .then(() => {
               setActiveAnswerImage(undefined);
            })
            .catch((error) => {
               console.log(error);
            })
         return;
      }
      if (e.allEntries[0].isUploading) {
         setActiveAnswerImage(0);
         return;
      }
      setActiveAnswerImage(e.allEntries[0].cdnUrl);
   }

   const updateInctiveAnswerImage = (e) => {
      if (!e.allEntries.length) {
         let uuid = inactiveAnswerImage.split("/");
         deleteFromUploadCare(uuid[uuid.length - 2])
            .then(() => {
               setInactiveAnswerImage(undefined);
            })
            .catch((error) => {
               console.log(error);
            })
         return;
      }
      if (e.allEntries[0].isUploading) {
         setInactiveAnswerImage(0);
         return;
      }
      setInactiveAnswerImage(e.allEntries[0].cdnUrl);
   }

   const updateQuestionSound = (e) => {
      if (!e.allEntries.length) {
         let uuid = questionSound?.split("/");
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

   const handleSelection = (selectedOptions) => {
      console.log(selectedOptions);
      if (option === undefined) {
         return;
      }
      setMultiCorrectAnswer(selectedOptions);
   }

   const handleQuestionSubmission = (e) => {
      if (quesCategory === "Select question category") {
         toast.warn("Please choose category");
         return;
      }
      else if (workingStructure === 1 && (ageGroup === "Select age group" || questionImageBefore === undefined || questionText === "" || questionImageAfter === undefined || totalOptions === 0 || option === undefined || correctAnswer === "-")) {
         toast.warn("Please fill all details");
         return;
      }
      else if (workingStructure === 2 && (ageGroup === "Select age group" || questionText === "" || questionImageAfter === undefined || totalOptions === 0 || option === undefined || correctAnswer === "-")) {
         toast.warn("Please fill all details");
         return;
      }
      else if (workingStructure === 3 && (ageGroup === "Select age group" || questionText === "" || totalOptions === 0 || option === undefined || correctAnswer === "-")) {
         toast.warn("Please fill all details");
         return;
      }
      else if (workingStructure === 4 && (ageGroup === "Select age group" || (enabledSound && questionSound === "") || (enabledText && enabledSound && questionSoundText === "") || (enabledText && !enabledSound && questionOnlyText === "") || questionText === "" || totalOptions === 0 || option === undefined || correctAnswer === "-")) {
         toast.warn("Please fill all details");
         return;
      }
      else if (workingStructure === 5 && (ageGroup === "Select age group" || questionText === "" || totalOptions === 0 || option === undefined || multiCorrectAnswer.length === 0)) {
         toast.warn("Please fill all details");
         return;
      }
      else if (workingStructure === 6 && (ageGroup === "Select age group" || questionText === "" || questionImageAfter === undefined || correctAnswer === "-" || answerImage === undefined || activeAnswerImage === undefined || inactiveAnswerImage === undefined)) {
         toast.warn("Please fill all details");
         return;
      }
      let correctAnswers = [];
      if (workingStructure === 5) {
         for (let i = 0; i < multiCorrectAnswer.length; i++) {
            correctAnswers.push(multiCorrectAnswer[i].value)
         }
      }
      let submission = {
         quesCategory,
         ageGroup,
         question: {
            structure: workingStructure,
            questionText,
            questionType: ((workingStructure >= 1 && workingStructure <= 6) && workingStructure !== 5) ? "single" : "multi",
            totalOptions: (workingStructure === 6 ? 4 : totalOptions),
            option,
            correctAnswer: workingStructure === 5 ? correctAnswers : [correctAnswer]
         }
      };
      switch (workingStructure) {
         case 1: submission = {
            ...submission, question: { ...submission.question, questionImage: { before: questionImageBefore, after: questionImageAfter } }
         }
            break;
         case 2: submission = {
            ...submission, question: { ...submission.question, questionImage: { after: questionImageAfter } }
         }
            break;
         case 4:
            if (enabledSound && enabledText)
               submission = { ...submission, question: { ...submission.question, questionSound, questionSoundText } }
            else if (enabledSound)
               submission = { ...submission, question: { ...submission.question, questionSound } }
            if (!enabledSound && enabledText)
               submission = { ...submission, question: { ...submission.question, questionOnlyText } }
            break;
         case 6: submission = {
            ...submission, question: { ...submission.question, questionImage: { after: questionImageAfter }, answerImage, option: { active: activeAnswerImage, inactive: inactiveAnswerImage } }
         }
            break;

         default:
            break;
      }
      axios.post(apiUrl + "assessment", submission)
         .then(({ data }) => {
            console.log(data);
            dispatch(addQuestion(data?.question))
            navigate("/questions")
         })
         .catch((error) => {
            console.error(error);
         })
      console.log(submission);
   }

   // const fetchEditableQuestion = useCallback(async () => {
   //    axios.get(apiUrl + "assessment/" + id)
   //       .then(({ data }) => {
   //          let { ageGroup, quesCategory, question } = data.questions;
   //          setExistingData(data.questions);

   //          setQuesCategory(quesCategory);
   //          setAgeGroup(ageGroup);
   //          setWorkingStructure(question?.structure);
   //          setTotalOptions(question?.totalOptions);
   //          setQuestionText(question?.questionText);
   //          setOption(question?.option)
   //          setCorrectAnswer(question?.questionType !== "multi" ? question?.correctAnswer[0] : question?.correctAnswer)
   //          if (question?.structure === 1 || question?.structure === 2) {
   //             setQuestionImageAfter(question?.questionImage?.after || undefined);
   //             if (question.structure === 1)
   //                setQuestionImageBefore(question?.questionImage?.before || undefined);
   //          } else if (question?.structure === 4) {
   //             if (question?.questionSound) {
   //                setQuestionSound(question?.questionSound)
   //                if (question?.questionSoundText){
   //                   setQuestionSoundText(question?.questionSoundText)
   //                   setEnabledText(true)
   //                }
   //                else {
   //                   setEnabledText(false)
   //                }
   //                setEnabledSound(true)
   //             } else if (question?.questionOnlyText) {
   //                setQuestionOnlyText(question?.questionOnlyText)
   //                setEnabledText(true)
   //                setEnabledSound(false)
   //             }
   //          }

   //       })
   //       .catch(error => {
   //          console.error(error);
   //       })
   // }, [id])

   const fetchCategory = useCallback(async () => {
      axios.get(adminApiUrl + "category")
         .then(({ data }) => {
            dispatch(setCategory(data.categories));
         })
         .catch((error) => {
            console.log(error);
         })
   }, [dispatch])

   const generateOptions = (len) => {
      let options = []
      for (let i = 0; i < len; i++) {
         options.push({ value: "o" + (i + 1), label: "option " + (i + 1) })
      }
      return options;
   }

   // useEffect(() => {
   //    if (id !== undefined) {
   //       fetchEditableQuestion()
   //    }
   // }, [fetchEditableQuestion, id])

   useEffect(() => {
      if (categories.length === 0)
         fetchCategory();
   }, [fetchCategory, categories])

   return (
      <div className='banner flex-jc'>
         <div className='banner w-45'>
            <div className='formFieldContainer'>
               <label className='fieldLabel'>Category</label>
               <select name="category" value={quesCategory} className='formField' onChange={(e) => {
                  setQuesCategory(e.target.value);
                  if (categories.filter((cat) => cat._id === e.target.value)[0]?.structure === 6) {
                     setTotalOptions(4);
                  }
                  setWorkingStructure(categories.filter((cat) => cat._id === e.target.value)[0]?.structure);
               }} id="category">
                  <option value="Select question category">Select question category</option>
                  {
                     categories.map((category, index) => {
                        return <option key={index} value={category._id}>{category.categoryName}</option>
                     })
                  }
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
                        workingStructure === 1 || workingStructure === 2 || workingStructure === 6 ?
                           <>
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
                                          <FaSpinner className='spin ml-12' />
                                          :
                                          <FaCheck className='ml-12' />
                                       :
                                       ""}
                                 </div>
                              </div>
                              {
                                 workingStructure === 6 ?
                                    <>
                                       <div className='formFieldContainer'>
                                          <label className='fieldLabel'>Answer Image</label>
                                          <div className='customFileUploadContainer'>
                                             <FileUploaderRegular
                                                pubkey="f0b48dbfeaff1298ebed"
                                                maxLocalFileSizeBytes={1500000}
                                                multiple={false}
                                                imgOnly={true}
                                                sourceList="local, camera, gdrive, gphotos"
                                                useCloudImageEditor={false}
                                                classNameUploader="my-config uc-light"
                                                onChange={(e) => updateAnswerImage(e)}
                                             />
                                             {answerImage !== undefined ?
                                                answerImage === 0 ?
                                                   <FaSpinner className='spin ml-12' />
                                                   :
                                                   <FaCheck className='ml-12' />
                                                :
                                                ""}
                                          </div>
                                       </div>
                                       <div className='formFieldContainer'>
                                          <label className='fieldLabel'>Inactive Image</label>
                                          <div className='customFileUploadContainer'>
                                             <FileUploaderRegular
                                                pubkey="f0b48dbfeaff1298ebed"
                                                maxLocalFileSizeBytes={1500000}
                                                multiple={false}
                                                imgOnly={true}
                                                sourceList="local, camera, gdrive, gphotos"
                                                useCloudImageEditor={false}
                                                classNameUploader="my-config uc-light"
                                                onChange={(e) => updateInctiveAnswerImage(e)}
                                             />
                                             {inactiveAnswerImage !== undefined ?
                                                inactiveAnswerImage === 0 ?
                                                   <FaSpinner className='spin ml-12' />
                                                   :
                                                   <FaCheck className='ml-12' />
                                                :
                                                ""}
                                          </div>
                                       </div>
                                       <div className='formFieldContainer'>
                                          <label className='fieldLabel'>Active Image</label>
                                          <div className='customFileUploadContainer'>
                                             <FileUploaderRegular
                                                pubkey="f0b48dbfeaff1298ebed"
                                                maxLocalFileSizeBytes={1500000}
                                                multiple={false}
                                                imgOnly={true}
                                                sourceList="local, camera, gdrive, gphotos"
                                                useCloudImageEditor={false}
                                                classNameUploader="my-config uc-light"
                                                onChange={(e) => updateActiveAnswerImage(e)}
                                             />
                                             {activeAnswerImage !== undefined ?
                                                activeAnswerImage === 0 ?
                                                   <FaSpinner className='spin ml-12' />
                                                   :
                                                   <FaCheck className='ml-12' />
                                                :
                                                ""}
                                          </div>
                                       </div>
                                    </>
                                    : ""
                              }
                           </>
                           : workingStructure === 4 && enabledSound ?
                              <div className='formFieldContainer'>
                                 <label className='fieldLabel'>Audio</label>
                                 <div className='customFileUploadContainer'>
                                    <FileUploaderRegular
                                       pubkey="f0b48dbfeaff1298ebed"
                                       maxLocalFileSizeBytes={5000000}
                                       multiple={false}
                                       sourceList="local, url, gdrive"
                                       useCloudImageEditor={false}
                                       classNameUploader="my-config uc-light"
                                       onChange={(e) => updateQuestionSound(e)}
                                    />
                                 </div>
                              </div>
                              : ""
                     }
                     {
                        workingStructure !== 6 ?
                           <div className="formFieldContainer">
                              <label className="fieldLabel">Select Total Options</label>
                              <select name="totalOptions" disabled={option !== undefined ? true : false} id="totalOptions" value={totalOptions} onChange={(e) => setTotalOptions(e.target.value)} className="formField">
                                 <option value={0}>Select Total Options</option>
                                 {
                                    workingStructure !== 5 ?
                                       <>
                                          <option value={2}>2</option>
                                          <option value={3}>3</option>
                                          <option value={4}>4</option>
                                       </>
                                       :
                                       <>
                                          <option value={10}>10</option>
                                          <option value={15}>15</option>
                                          <option value={20}>20</option>
                                       </>
                                 }
                              </select>
                           </div>
                           :
                           ""
                     }
                     <div className='formFieldContainer'>
                        {
                           totalOptions !== 0 ?
                              <>
                                 {
                                    workingStructure !== 6 ?
                                       <>
                                          <label className='fieldLabel'> {totalOptions !== 0 ? "Select " + totalOptions + " photos as options" : ""}</label>
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
                                       </>
                                       : ""
                                 }
                                 <div className="formFieldContainer">
                                    {

                                       workingStructure !== 5 ?
                                          <>
                                             <label className="fieldLabel">Select Correct Answer</label>
                                             <select name="correctAnswer" id="correctAnswer" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="formField">
                                                <option value="-">Select Correct Answer</option>
                                                {
                                                   [1, 2, 3, 4].map((num, index) => {
                                                      if (totalOptions >= num) {
                                                         return <option key={index} value={"o" + num}>{num}</option>
                                                      }
                                                      else return "";
                                                   })
                                                }

                                             </select>
                                          </>

                                          :
                                          workingStructure === 5 ?
                                             <>
                                                <label className="fieldLabel">Select Correct Answer</label>
                                                <Select
                                                   isMulti
                                                   options={generateOptions(totalOptions)}
                                                   value={multiCorrectAnswer}
                                                   // onChange={(e) => handleSelection(e.target.value)}
                                                   onChange={handleSelection}
                                                />
                                             </>

                                             : ""
                                    }
                                 </div>
                              </>
                              : workingStructure === 6 ?
                                 <>

                                 </>
                                 :
                                 ""
                        }
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