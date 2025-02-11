import React, { useCallback, useEffect, useState } from 'react'
import "./AddQuestion.css"
// eslint-disable-next-line
import { useDispatch, useSelector } from 'react-redux'
import Structure1to4 from '../Components/Structure1-4';
import Structure5 from '../Components/Structure5';
import Structure6 from '../Components/Structure6';
import Structure7 from '../Components/Structure7';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import FileUploader from '../Components/FileUploaderRegular';
import { FaSpinner, FaCheck } from "react-icons/fa6";
import Button from '../Components/Common/Button';
import { toast } from 'react-toastify';
// eslint-disable-next-line
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminApiUrl, { apiUrl } from '../adminApiUrl';
import { addQuestion, setCategory } from '../redux/actions/actions';
import Select from 'react-select';

import Agarbatti from "../Components/Images/Agarbatti.png"
import Food from "../Components/Images/Food.png"
import IceBowl from "../Components/Images/IceBowl.png"
import RedBall from "../Components/Images/RedBall.png"
import Speaker from "../Components/Images/Speaker.png"
import Ear from "../Components/Images/ear.png"
import Eyes from "../Components/Images/eyes.png"
import Hand from "../Components/Images/hand.png"
import Nose from "../Components/Images/nose.png"
import Candle from "../Components/Images/candle.png"
import Icecream from "../Components/Images/icecream.png"
import Perfume from "../Components/Images/perfume.png"
import Teddy from "../Components/Images/teddyBear.png"
import DemoSpeaker from "../Components/Images/demoSpeaker.png"
import Tongue from "../Components/Images/tongue.png"
import Structure8 from '../Components/Structure8';

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
   const [neutralAnswer, setNeutralAnswer] = useState("-");
   const [option, setOption] = useState();
   const [questionSound, setQuestionSound] = useState("");
   const [questionOnlyText, setQuestionOnlyText] = useState("");
   const [questionSoundText, setQuestionSoundText] = useState("");
   const [enabledSound, setEnabledSound] = useState(true);
   const [enabledText, setEnabledText] = useState(true);
   const [answerImage, setAnswerImage] = useState(undefined);
   const [activeAnswerImage, setActiveAnswerImage] = useState(undefined);
   const [inactiveAnswerImage, setInactiveAnswerImage] = useState(undefined);
   // console.log("option at 64 ", option);
   // console.log("option at 65 ", typeof option);
   const [matches, setMatches] = useState([]);

   const leftColumn = {
      Demo: [
         {
            val: "त्वचा",
            src: Hand
         },
         {
            val: "आंख",
            src: Eyes
         },
         {
            val: "कान",
            src: Ear
         },
         {
            val: "नाक",
            src: Nose
         },
         {
            val: "जीभ",
            src: Tongue
         }
      ],
      Ques: [
         {
            val: "जीभ",
            src: Tongue
         },
         {
            val: "आंख",
            src: Eyes
         },
         {
            val: "कान",
            src: Ear
         },
         {
            val: "त्वचा",
            src: Hand
         },
         {
            val: "नाक",
            src: Nose
         }
      ]
   }
   const rightColumn = {
      Demo: [
         {
            val: "Candle",
            src: Candle
         },
         {
            val: "IceCream",
            src: Icecream
         },
         {
            val: "Perfume",
            src: Perfume
         },
         {
            val: "Teddy",
            src: Teddy
         },
         {
            val: "Speaker",
            src: DemoSpeaker
         }
      ],
      Ques: [
         {
            val: "Ball",
            src: RedBall
         },
         {
            val: "Jalebi",
            src: Food
         },
         {
            val: "Agarbatti",
            src: Agarbatti
         },
         {
            val: "Ice",
            src: IceBowl
         },
         {
            val: "Speaker",
            src: Speaker
         }
      ]
   }

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
         case 7: return <Structure7
            questionText={questionText}
            leftColumn={getCategoryName(quesCategory).includes("AAA") ? leftColumn.Demo : leftColumn.Ques}
            rightColumn={getCategoryName(quesCategory).includes("AAA") ? rightColumn.Demo : rightColumn.Ques}
            matches={matches}
            setMatches={setMatches}
         />
         case 8: return <Structure8
            questionText={questionText}
            questionImageAfter={questionImageAfter}
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

   const updateOptions = (opt = []) => {
      let option = []
      for (let i = 0; i < opt.length; i++) {
         option.push(opt[i]);
      }
      setOption(option);
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

   const handleQuestionSubmission = async (e) => {
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
      if (workingStructure === 7) {
         for (let i = 0; i < matches.length; i++) {
            correctAnswers.push(`${matches[i].left.val}-${matches[i].right}`)
         }
      }

      const formData = new FormData();

      formData.append("quesCategory", quesCategory || "")
      formData.append("ageGroup", ageGroup || "")
      formData.append("structure", workingStructure || -1)
      formData.append("questionText", questionText || "")
      formData.append("questionType", ((workingStructure >= 1 && workingStructure <= 6) && workingStructure !== 5) ? "single" : workingStructure === 8 ? "draw" : "multi")
      formData.append("totalOptions", workingStructure === 8 ? -1 : (workingStructure === 6 ? 4 : totalOptions))
      formData.append("correctAnswer", workingStructure === 5 || workingStructure === 7 ? correctAnswers : workingStructure === 8 ? ["draw"] : workingStructure === 2 && totalOptions > 2 && quesCategory.includes("6729d6893ae29c44e7450897") ? [correctAnswer, neutralAnswer] : [correctAnswer])
      let submission;
      switch (workingStructure) {
         case 1:
            // console.log(totalOptions)
            for (let index = 0; index < totalOptions; index++) {
               const element = option[index];
               formData.append(`option.` + index, element)
            }
            formData.append("questionImageBefore", questionImageBefore)
            formData.append("questionImageAfter", questionImageAfter)
            break;
         case 2:
            // console.log(totalOptions)
            for (let index = 0; index < totalOptions; index++) {
               const element = option[index];
               formData.append(`option.` + index, element)
            }
            formData.append("questionImageAfter", questionImageAfter)
            break;
         case 4:
            if (enabledSound && enabledText)
               submission = { ...submission, question: { ...submission.question, option, questionSound, questionSoundText } }
            else if (enabledSound)
               submission = { ...submission, question: { ...submission.question, option, questionSound } }
            if (!enabledSound && enabledText)
               submission = { ...submission, question: { ...submission.question, option, questionOnlyText } }
            break;
         case 3:
         case 5: submission = {
            ...submission,
            question: { ...submission.question, option }
         }
            break;
         case 6: submission = {
            ...submission, question: { ...submission.question, questionImage: { after: questionImageAfter }, answerImage, option: { active: activeAnswerImage, inactive: inactiveAnswerImage } }
         }
            break;
         case 8: submission = {
            ...submission,
            question: {
               ...submission.question, questionImage: { after: questionImageAfter }
            }
         }
            break;
         default:
            break;
      }

      // console.log(formData.entries());
      try {
         const response = await fetch(apiUrl + "assessment", {
            method: "POST",
            body: formData
         })
         const data = await response.json();
         // console.log("Response", data);
         dispatch(addQuestion(data?.question))
         navigate("/questions")
      } catch (error) {
         console.error("Upload Failed", error)
      }
      // axios.post(apiUrl + "assessment", formData)
      //    .then(({ data }) => {
      //       console.log(data);
      //    })
      //    .catch((error) => {
      //       console.error(error);
      //    })
   }

   const getCategoryName = (id) => {
      return categories.filter((cat) => cat._id === id)[0].categoryName
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
               <label htmlFor='category' className='fieldLabel'>Category</label>
               <select id="category" name="category" value={quesCategory} className='formField' onChange={(e) => {
                  setQuesCategory(e.target.value);
                  if (categories.filter((cat) => cat._id === e.target.value)[0]?.structure === 6) {
                     setTotalOptions(4);
                  }
                  else if (categories.filter((cat) => cat._id === e.target.value)[0]?.structure === 7) {
                     setTotalOptions(5);
                  }
                  setWorkingStructure(categories.filter((cat) => cat._id === e.target.value)[0]?.structure);
               }}>
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
                        <label htmlFor='ageGroup' className='fieldLabel'>Age Group</label>
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
                              <span className='fieldLabel'>Question Title Image</span>
                              <div className='customFileUploadContainer'>
                                 <FileUploader
                                    updateFileFunc={setQuestionImageBefore}
                                 />
                              </div>
                           </div>
                           : ""
                     }
                     <div className='formFieldContainer'>
                        <label htmlFor='questionText' className='fieldLabel'>Question Text</label>
                        <input type="text" name="questionText" id="questionText" className='formField' value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
                     </div>
                     {
                        workingStructure === 4 ?
                           <>
                              <div>
                                 <label htmlFor='audio' className='fieldLabel'>Audio</label>
                                 <input type="checkbox" name="audioText" id="audio" checked={enabledSound} onChange={() => { if (enabledText === false && enabledSound === true) { return; } setEnabledSound(!enabledSound); setQuestionSoundText(""); setQuestionOnlyText(""); }} />
                                 <label htmlFor='text' className='fieldLabel'>Text</label>
                                 <input type="checkbox" name="audioText" id="text" checked={enabledText} onChange={() => { if (enabledText === true && enabledSound === false) { return; } setEnabledText(!enabledText) }} />
                              </div>
                              {
                                 enabledText ?
                                    <div className='formFieldContainer'>
                                       <label htmlFor='questionTextAudio' className='fieldLabel'>Question {enabledSound || !enabledText ? "Sound" : "Sub"} Text</label>
                                       <input type="text" name="questionText" id="questionTextAudio" className='formField' value={enabledSound || !enabledText ? questionSoundText : questionOnlyText} onChange={(e) => { enabledSound || !enabledText ? setQuestionSoundText(e.target.value) : setQuestionOnlyText(e.target.value) }} />
                                    </div>
                                    : ""
                              }
                           </>
                           :
                           ""
                     }
                     {
                        workingStructure === 1 || workingStructure === 2 || workingStructure === 6 || workingStructure === 8 ?
                           <>
                              <div className='formFieldContainer'>
                                 <span className='fieldLabel'>Question Image</span>
                                 <div className='customFileUploadContainer'>
                                    <FileUploader
                                       updateFileFunc={setQuestionImageAfter}
                                    />
                                 </div>
                              </div>
                              {
                                 workingStructure === 6 ?
                                    <>
                                       <div className='formFieldContainer'>
                                          <label htmlFor='fileInput' className='fieldLabel'>Answer Image</label>
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
                                          <label htmlFor='fileInput' className='fieldLabel'>Inactive Image</label>
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
                                          <label htmlFor='fileInput' className='fieldLabel'>Active Image</label>
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
                                 <label htmlFor='fileInput' className='fieldLabel'>Audio</label>
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
                        workingStructure !== 6 && workingStructure !== 7 && workingStructure !== 8 ?
                           <div className="formFieldContainer">
                              <label htmlFor='totalOptions' className="fieldLabel">Select Total Options</label>
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
                                          <option value={8}>8</option>
                                          <option value={10}>10</option>
                                       </>
                                 }
                              </select>
                           </div>
                           :
                           ""
                     }
                     <>
                        {
                           totalOptions !== 0 ?
                              <>
                                 {
                                    workingStructure !== 6 && workingStructure !== 7 && workingStructure !== 8 ?
                                       <div className="formFieldContainer">
                                          <span className='fieldLabel'> {totalOptions !== 0 ? "Select " + totalOptions + " photos as options" : ""}</span>
                                          <div className='customFileUploadContainer'>

                                             <FileUploader
                                                multiple
                                                updateFileFunc={updateOptions}
                                             // updateStatus={updateOptions}
                                             />
                                          </div>
                                       </div>
                                       : ""
                                 }
                                 <>
                                    {

                                       workingStructure !== 5 && workingStructure !== 7 && workingStructure !== 8 ?
                                          <>
                                             <div className="formFieldContainer">
                                                <label htmlFor='correctAnswer' className="fieldLabel">Select Correct Answer</label>
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
                                             </div>
                                             {
                                                // ANCHOR need to fix this as the category id wont be fixed always
                                                totalOptions > 2 && quesCategory.includes("6729d6893ae29c44e7450897") ?
                                                   <div className="formFieldContainer">
                                                      <label htmlFor='neutralAnswer' className="fieldLabel">Select Neutral Answer</label>
                                                      <select name="neutralAnswer" id="neutralAnswer" value={neutralAnswer} onChange={(e) => setNeutralAnswer(e.target.value)} className="formField">
                                                         <option value="-">Select Neutral Answer</option>
                                                         {
                                                            [1, 2, 3, 4].map((num, index) => {
                                                               if (totalOptions >= num && correctAnswer !== ("o" + num)) {
                                                                  return <option key={index} value={"o" + num}>{num}</option>
                                                               }
                                                               else return "";
                                                            })
                                                         }

                                                      </select>
                                                   </div>

                                                   : ``
                                             }
                                          </>


                                          :
                                          workingStructure === 5 ?
                                             <div className="formFieldContainer">
                                                <label className="fieldLabel">Select Correct Answer</label>
                                                <Select
                                                   isMulti
                                                   options={generateOptions(totalOptions)}
                                                   value={multiCorrectAnswer}
                                                   onChange={handleSelection}
                                                />
                                             </div>
                                             : workingStructure === 7 ?
                                                <div className="formFieldContainer">
                                                   <label className="fieldLabel">Correct Answers</label>
                                                   {
                                                      matches?.map((val, index) => {
                                                         return <span key={index}>
                                                            <span>Left: {val.left.val}</span>
                                                            <span style={{
                                                               marginLeft: "10px"
                                                            }}>
                                                               Right: {val.right}
                                                            </span>
                                                         </span>
                                                      })
                                                   }
                                                </div>
                                                : ""
                                    }
                                 </>
                              </>
                              :
                              ""
                        }
                     </>

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