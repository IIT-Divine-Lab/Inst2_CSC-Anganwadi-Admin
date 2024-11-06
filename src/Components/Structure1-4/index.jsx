import React from 'react'
import "./style.css"
import { HiSpeakerWave } from "react-icons/hi2";
import Heading from '../Common/Heading'
import Body from '../Common/Body';
import ParentContainer from '../Common/ParentContainer';
import Button from '../Common/Button';

const Structure1to4 = ({ view, structure, questionText, questionImageBefore, questionImageAfter, totalOptions = 4, option, questionOnlyText, questionSound, questionSoundText, enabledText, enabledSound, correctAnswer }) => {
   // let question = {
   //    structure: 4,
   //    questionText: "Select the correct symbol inside the shape.",
   //    questionSound,
   //    questionSoundText: "Select...",
   //    questionOnlyText: "Select the correct symbol",
   //    questionType: "single",
   //    questionImage: {
   //       before: questionImageBefore,
   //       after: questionImageAfter
   //    },
   //    totalOptions: 4,
   //    option: {
   //       o1: option1,
   //       o2: option2,
   //       o3: option3,
   //       o4: option4
   //    }
   // }

   const playAudio = () => {
      var aud = document.getElementById("audioQues");
      aud.play();
   }

   return (
      <ParentContainer view={view ? 0.5 : false}>
         {
            structure === 1 ?
               questionImageBefore !== undefined ?
                  <div>
                     <img className='quesImageBefore' style={questionImageAfter !== undefined ? { height: "auto", backgroundColor: "transparent" } : { minHeight: "100px" }} src={questionImageBefore} alt="" />
                  </div>
                  :
                  <div className='quesImageBefore'></div>
               :
               ""
         }
         <Heading>
            {questionText !== "" ? questionText : "Your question text will appear."}
         </Heading>
         <Body>
            {
               structure === 1 || structure === 2 ?
                  questionImageAfter !== undefined ?
                     <div>
                        <img style={structure === 2 ? { height: "300px", width: "auto", backgroundColor: "transparent" } : { backgroundColor: "transparent" }} className='quesImageAfter' src={questionImageAfter} alt="" />
                     </div>
                     :
                     <div style={{ minHeight: "120px" }} className='quesImageAfter'></div>
                  : structure === 4 ?
                     <>
                        {
                           enabledSound === true ?
                              <audio loops={false} id='audioQues' className='audioQues' src={questionSound}></audio>
                              : ""
                        }
                        <div className='audioContainer'>
                           {
                              enabledSound === true ?
                                 <HiSpeakerWave onClick={questionSound !== undefined ? playAudio : () => { }} className='speaker' />
                                 : ""
                           }
                           {
                              enabledSound === true && enabledText === true ?
                                 <span style={{ marginLeft: "10px" }}>{questionSoundText || "Text appear here"}</span>
                                 : enabledSound === false ?
                                    <span>{questionOnlyText || "Text appear here"}</span>
                                    : ""
                           }
                        </div>
                     </>
                     : <>
                     </>
            }
            <div className="quesOptionContainer">
               <div className='rowContainer' style={totalOptions >= 3 ? { flexWrap: "wrap" } : {}}>
                  <div className="optionContainer">
                     <img src={option?.o1} alt='' className={correctAnswer && correctAnswer[0] === "o1" ? "option optionActive" : "option"} style={option?.o1 === undefined ? { minHeight: "120px", backgroundColor: "#cacaca" } : {}} />
                     <input type="radio" name="q1" id="a1" className='chooseOption' />
                  </div>
                  {
                     totalOptions >= 2 ?
                        <div className="optionContainer">
                           <img src={option?.o2} alt='' className={correctAnswer && correctAnswer[0] === "o2" ? "option optionActive" : "option"} style={option?.o2 === undefined ? { minHeight: "120px", backgroundColor: "#cacaca" } : {}} />
                           <input type="radio" name="q1" id="a2" className='chooseOption' />
                        </div>
                        :
                        ""
                  }
                  {
                     totalOptions >= 3 ?
                        <div className="optionContainer" style={totalOptions >= 3 ? { marginLeft: "0px", marginTop: "40px" } : {}}>
                           <img src={option?.o3} alt='' className={correctAnswer && correctAnswer[0] === "o3" ? "option optionActive" : "option"} style={option?.o3 === undefined ? { minHeight: "120px", backgroundColor: "#cacaca" } : {}} />
                           <input type="radio" name="q1" id="a3" className='chooseOption' />
                        </div>
                        :
                        ""
                  }
                  {
                     totalOptions >= 4 ?
                        <div className="optionContainer" style={totalOptions >= 3 ? { marginTop: "40px" } : {}}>
                           <img src={option?.o4} alt='' className={correctAnswer && correctAnswer[0] === "o4" ? "option optionActive" : "option"} style={option?.o4 === undefined ? { minHeight: "120px", backgroundColor: "#cacaca" } : {}} />
                           <input type="radio" name="q1" id="a2" className='chooseOption' />
                        </div>
                        :
                        ""
                  }
               </div>
            </div>
         </Body>
         <Button>
            Next
         </Button>
      </ParentContainer>
   )
}

export default Structure1to4