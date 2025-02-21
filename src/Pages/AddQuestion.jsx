import React, { useCallback, useEffect, useState } from 'react'
import "./AddQuestion.css"
import { useDispatch, useSelector } from 'react-redux'
import Structure1to4 from '../Components/Structure1-4';
import Structure5 from '../Components/Structure5';
import Structure6 from '../Components/Structure6';
import Structure7 from '../Components/Structure7';
import Structure8 from '../Components/Structure8';
import Input from "../Components/Input Field"
import FileUploader from '../Components/FileUploaderRegular';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminApiUrl, { apiUrl } from '../adminApiUrl';
import { addQuestion, modifyQuestion, setCategory } from '../redux/actions/actions';
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

const AddQuestion = ({ loggedIn }) => {
   const categories = useSelector((state) => state.categories);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const location = useLocation();
   const id = location?.state?.id || undefined;

   const [existingData, setExistingData] = useState({});
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
   const [matches, setMatches] = useState([]);

   useEffect(() => {
      console.log(quesCategory);
      if (!loggedIn)
         navigate("/");
   }, [loggedIn, navigate, quesCategory])

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
      switch (selectCategory[0]?.structure) {
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
               options={option}
               enabledSound={enabledSound}
               enabledText={enabledText}
               questionSound={questionSound}
               correctAnswer={correctAnswer}
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
            leftColumn={getCategoryName(quesCategory).includes("Demo") ? leftColumn.Demo : leftColumn.Ques}
            rightColumn={getCategoryName(quesCategory).includes("Demo") ? rightColumn.Demo : rightColumn.Ques}
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

   const updateOptions = (opt = []) => {
      let option = []
      for (let i = 0; i < opt.length; i++) {
         option.push(opt[i]);
      }
      setOption(option);
   }

   const handleSelection = (selectedOptions) => {
      if (option === undefined) {
         return;
      }
      selectedOptions.sort((a, b) => Number(a.value) - Number(b.value));
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

      if (workingStructure === 6) {
         formData.append(`answerImage`, answerImage)
         formData.append(`option.active`, activeAnswerImage)
         formData.append(`option.inactive`, inactiveAnswerImage)
      }
      else if (workingStructure !== 6 || workingStructure !== 8) {
         for (let index = 0; index < totalOptions; index++) {
            formData.append(`option.` + index, option[index]);
         }
      }
      if (workingStructure === 1 || workingStructure === 2 || workingStructure === 6 || workingStructure === 8) {
         formData.append("questionImageAfter", questionImageAfter)
         if (workingStructure === 1)
            formData.append("questionImageBefore", questionImageBefore)
      }
      if (workingStructure === 4) {
         if (enabledSound) {
            formData.append("questionSound", questionSound)
            if (enabledText)
               formData.append("questionSoundText", questionSoundText)
         }
         else
            formData.append("questionOnlyText", questionOnlyText)
      }

      try {
         const response = await fetch(apiUrl + "assessment", {
            method: "POST",
            body: formData
         })
         const data = await response.json();
         dispatch(addQuestion(data?.question))
         navigate("/questions")
      } catch (error) {
         console.error("Upload Failed", error)
      }
   }

   const getCategoryName = (id) => {
      return categories.filter((cat) => cat._id === id)[0].categoryName
   }

   const fetchEditableQuestion = useCallback(async () => {
      axios.get(apiUrl + "assessment/" + id)
         .then(({ data }) => {
            let { ageGroup, quesCategory, question } = data.questions;
            setExistingData(data.questions);
            setQuesCategory(typeof (quesCategory) === "object" ? quesCategory._id : quesCategory);
            setAgeGroup(ageGroup);
            setWorkingStructure(question?.structure);
            setTotalOptions(question?.totalOptions);
            setQuestionText(question?.questionText);
            setOption(question?.option)
            setCorrectAnswer(question?.questionType !== "multi" ? question?.correctAnswer[0] : question?.correctAnswer)
            if (question?.structure === 1 || question?.structure === 2 || question?.structure === 6) {
               setQuestionImageAfter(question?.questionImage?.after || undefined);
               if (question.structure === 1)
                  setQuestionImageBefore(question?.questionImage?.before || undefined);
               if (question?.structure === 6) {
                  setActiveAnswerImage(question?.option[0])
                  setInactiveAnswerImage(question?.option[1])
                  setAnswerImage(question?.answerImage)
               }
            } else if (question?.structure === 4) {
               if (question?.questionSound) {
                  setQuestionSound(question?.questionSound)
                  if (question?.questionSoundText) {
                     setQuestionSoundText(question?.questionSoundText)
                     setEnabledText(true)
                  }
                  else {
                     setEnabledText(false)
                  }
                  setEnabledSound(true)
               } else if (question?.questionOnlyText) {
                  setQuestionOnlyText(question?.questionOnlyText)
                  setEnabledText(true)
                  setEnabledSound(false)
               }
            }
            else if (question?.structure === 5) {
               let a = []
               let b = question.correctAnswer[0].split(",");
               for (let i = 0; i < b.length; i++) {
                  a.push({ value: b[i], label: "option " + (Number(b[i]) + 1) })
               }
               a.sort((a, b) => Number(a.value) - Number(b.value));
               setMultiCorrectAnswer(a);
            }
         })
         .catch(error => {
            console.error(error);
         })
   }, [id])

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
         if (id) {
            if (multiCorrectAnswer !== undefined) {
               if (!(multiCorrectAnswer.some((option) => option.value === i.toString())))
                  options.push({ value: i.toString(), label: "option " + (i + 1) })
            }
         }
         else
            options.push({ value: (i), label: "option " + (i + 1) })
      }
      return options;
   }

   const handleEditQuestion = async () => {
      // console.log(existingData)
      const structure = workingStructure;
      let question = {
         structure,
         questionText,
         questionType: existingData.question.questionType,
      }
      if (structure === 1 || structure === 2) {
         if (structure === 1)
            question = { ...question, questionImage: { before: questionImageBefore } }
         question = { ...question, questionImage: { ...question.questionImage, after: questionImageAfter } }
      }
      if (structure === 4) {
         if (enabledSound) {
            question = { ...question, questionSound }
         }
         if (enabledText) {
            question = { ...question, questionSoundText }
         }
      } else if (enabledText) {
         question = { ...question, questionOnlyText }
      }
      question = {
         ...question,
         totalOptions,
         option,
         correctAnswer: structure === 5 || structure === 7 ? correctAnswer : [correctAnswer]
      }
      let newData = {
         question,
         _id: existingData._id,
         ageGroup,
         quesCategory,
         __v: 0,
      }
      if (!(JSON.stringify(existingData) === JSON.stringify(newData))) {
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

         formData.append("quesCategory", quesCategory)
         formData.append("ageGroup", ageGroup)
         formData.append("structure", structure)
         formData.append("questionText", questionText)
         formData.append("questionType", ((structure >= 1 && structure <= 6) && structure !== 5) ? "single" : structure === 8 ? "draw" : "multi")
         formData.append("totalOptions", structure === 8 ? -1 : (structure === 6 ? 4 : totalOptions))
         formData.append("correctAnswer", structure === 5 || structure === 7 ? correctAnswers : structure === 8 ? ["draw"] : structure === 2 && totalOptions > 2 && quesCategory.includes("6729d6893ae29c44e7450897") ? [correctAnswer, neutralAnswer] : [correctAnswer])

         // console.log(option);
         if (structure === 6) {
            formData.append(`answerImage`, answerImage === existingData.question.answerImage ? JSON.stringify(answerImage) : answerImage)
            if (JSON.stringify(activeAnswerImage) === JSON.stringify(existingData.question.option[0]) || JSON.stringify(inactiveAnswerImage) === JSON.stringify(existingData.question.option[1])) {
               formData.append(`option`, JSON.stringify([activeAnswerImage, inactiveAnswerImage]))
            }
            else {
               formData.append(`option.active`, activeAnswerImage)
               formData.append(`option.inactive`, inactiveAnswerImage)
            }
         }
         else if (structure !== 6 || structure !== 8) {
            if (JSON.stringify(totalOptions) === JSON.stringify(existingData.question.totalOptions)) {
               if (JSON.stringify(option) === JSON.stringify(existingData.question.option)) {
                  let a = [];
                  for (let index = 0; index < totalOptions; index++) {
                     a.push(option[index]);
                  }
                  formData.append(`option`, JSON.stringify(a));
               }
               else {
                  for (let index = 0; index < totalOptions; index++) {
                     formData.append(`option.` + index, option[index]);
                  }
               }
            }
            else {
               if (option === undefined) {
                  toast("Options is required.", {
                     autoClose: 1500,
                     type: "warning"
                  })
                  return;
               }
               for (let index = 0; index < totalOptions; index++) {
                  formData.append(`option.` + index, option[index]);
               }
            }
         }
         if (structure === 1 || structure === 2 || structure === 6 || structure === 8) {
            formData.append("questionImageAfter", JSON.stringify(questionImageAfter))
            if (structure === 1)
               formData.append("questionImageBefore", JSON.stringify(questionImageBefore))
         }
         if (structure === 4) {
            if (enabledSound) {
               formData.append("questionSound", questionSound)
               if (enabledText)
                  formData.append("questionSoundText", questionSoundText)
            }
            else
               formData.append("questionOnlyText", questionOnlyText)
         }
         if (structure === 5) {
            let originalAnswer = existingData.question.correctAnswer[0].split(",");
            originalAnswer.sort((a, b) => Number(a) - Number(b));
            if (JSON.stringify(originalAnswer) === JSON.stringify(correctAnswers)) {
               toast("No Changes", {
                  autoClose: 1500,
                  type: "info"
               })
               return;
            }
            // existingData.question.option.sort((a, b) => Number(a.value) - Number(b.value));
         }

         try {
            const response = await fetch(apiUrl + `assessment/${id}`, {
               method: "PUT",
               body: formData
            })
            const data = await response.json();
            console.log(data);
            dispatch(modifyQuestion(data?.question))
            navigate("/questions")
         } catch (error) {
            console.error("Upload Failed", error)
         }
      }
      else {
         toast("No Changes", {
            autoClose: 1500,
            type: "info"
         })
      }

   }

   useEffect(() => {
      if (id !== undefined) {
         fetchEditableQuestion()
      }
   }, [fetchEditableQuestion, id])

   useEffect(() => {
      if (categories.length === 0)
         fetchCategory();
   }, [fetchCategory, categories])

   return (
      <div className='banner'>
         <h1>
            Questions Data / {id ? "Edit" : "Add"} Question
         </h1>
         <div className='flex-jc w-100'>
            <div className='banner w-47'>
               <div className='formFieldContainer'>
                  <label htmlFor='category' className='fieldLabel'>Category</label>
                  <select id="category" name="category" disabled={id ? true : false} value={quesCategory} className='formField' onChange={(e) => {
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
                           return <option key={index} value={category._id}>{category.categoryName.split(" kush ")[0] + " - " + category.categoryName.split(" kush")[1]}</option>
                        })
                     }
                  </select>
               </div>
               <hr />
               {
                  quesCategory !== "Select question category" ? (
                     <>
                        <Input
                           labelFor='ageGroup'
                           labelText='Age Group'
                           disabled={id ? true : false}
                           id="ageGroup"
                           name="ageGroup"
                           value={ageGroup}
                           onChange={(e) => setAgeGroup(e.target.value)}
                           options={
                              [{
                                 value: "Select age group",
                                 label: "Select age group"
                              }, {
                                 value: "3-4",
                                 label: "3-4"
                              }, {
                                 value: "4-5",
                                 label: "4-5"
                              }, {
                                 value: "5-6",
                                 label: "5-6"
                              }, {
                                 value: "common",
                                 label: "For all groups"
                              }]
                           }
                        />

                        {
                           workingStructure === 1 ?
                              <Input
                                 spanText='Question Title Image'
                                 uploadFunc={setQuestionImageBefore}
                              />
                              : ""
                        }
                        <Input
                           labelFor='questionText'
                           labelText='Question Text'
                           inputType='text'
                           name='questionText'
                           id='questionText'
                           value={questionText}
                           onChange={(e) => setQuestionText(e.target.value)}
                        />
                        {
                           workingStructure === 4 ?
                              <>
                                 <div style={{ display: "flex", marginTop: "10px" }}>
                                    <Input
                                       labelFor='questionTextAudio'
                                       labelText="Sub Text"
                                    />
                                    <input type="checkbox" name="audioText" id="text" checked={enabledText} onChange={() => { if (enabledText === true && enabledSound === false) { return; } setEnabledText(!enabledText) }} />
                                 </div>
                                 {
                                    enabledText ?
                                       <Input
                                          containerStyle={{ marginTop: "0" }}
                                          inputType="text"
                                          name="questionTextAudio"
                                          id="questionTextAudio"
                                          value={enabledSound || !enabledText ? questionSoundText : questionOnlyText}
                                          onChange={(e) => { enabledSound || !enabledText ? setQuestionSoundText(e.target.value) : setQuestionOnlyText(e.target.value) }}
                                       />
                                       : ""
                                 }
                              </>
                              :
                              ""
                        }
                        {
                           workingStructure === 1 || workingStructure === 2 || workingStructure === 6 || workingStructure === 8 ?
                              <>
                                 <Input
                                    spanText='Question Image'
                                    uploadFunc={setQuestionImageAfter}
                                 />
                                 {
                                    workingStructure === 6 ?
                                       <>
                                          <Input
                                             spanText='Answer Image'
                                             uploadFunc={setAnswerImage}
                                          />
                                          <Input
                                             spanText='Inactive Image'
                                             uploadFunc={setInactiveAnswerImage}
                                          />
                                          <Input
                                             spanText='Active Image'
                                             uploadFunc={setActiveAnswerImage}
                                          />
                                       </>
                                       : ""
                                 }
                              </>
                              : workingStructure === 4 ?
                                 <>
                                    <div style={{ display: "flex", marginTop: "10px" }}>
                                       <Input
                                          labelFor='questionTextAudio'
                                          labelText='Audio'
                                       />
                                       <input type="checkbox" name="audioText" id="audio" checked={enabledSound} onChange={() => { if (enabledText === false && enabledSound === true) { return; } setEnabledSound(!enabledSound); setQuestionSoundText(""); setQuestionOnlyText(""); }} />
                                    </div>
                                    {

                                       enabledSound ?
                                          <Input
                                             containerStyle={{ marginTop: "0" }}
                                             uploadFunc={setQuestionSound}
                                             uploadAccept='audio/*'
                                          /> : ""
                                    }
                                 </>
                                 : ""
                        }
                        {
                           workingStructure !== 6 && workingStructure !== 7 && workingStructure !== 8 ?
                              <div className="formFieldContainer">
                                 <label htmlFor='totalOptions' className="fieldLabel">Select Total Options</label>
                                 <select name="totalOptions" disabled={id ? workingStructure === 5 || workingStructure === 7 ? true : false : option !== undefined ? true : false} id="totalOptions" value={totalOptions} onChange={(e) => {
                                    if (id) {
                                       setOption(undefined);
                                    }
                                    setTotalOptions(e.target.value)
                                 }} className="formField">
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
                                                   uploadAccept='image/*'
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
                                                               return <option key={index} value={num}>{num}</option>
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
                        <div className='formFieldContainer' onClick={id === undefined ? handleQuestionSubmission : handleEditQuestion} style={{ width: "max-content", marginTop: "40px" }}>
                           <button style={{ fontSize: "14px", width: "unset" }} className="actionBtn">Save Question</button>
                        </div>
                     </>
                  )
                     : ""

               }

            </div>
            <div className='banner w-47'>
               {
                  quesCategory !== "Select question category" && struct()
               }
            </div>
         </div>
      </div >
   )
}

export default AddQuestion