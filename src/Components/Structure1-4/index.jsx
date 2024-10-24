import React from 'react'
import "./style.css"
import { HiSpeakerWave } from "react-icons/hi2";
import Heading from '../Common/Heading'
import Body from '../Common/Body';
import ParentContainer from '../Common/ParentContainer';
import Button from '../Common/Button';

const Structure1to4 = ({ structure, questionText, questionImageBefore, questionImageAfter, totalOptions = 4, o1, o2, o3, o4, questionOnlyText, questionSound, questionSoundText }) => {
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
      <ParentContainer>
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
                           !questionOnlyText && questionSound ?
                              <audio loops={false} id='audioQues' className='audioQues' src={questionSound}></audio>
                              : ""
                        }
                        <div className='audioContainer'>
                           {
                              !questionOnlyText ?
                                 <HiSpeakerWave onClick={questionSound !== undefined ? playAudio : () => { }} className='speaker' />
                                 : ""
                           }
                           {
                              questionSoundText ?
                                 <span style={{ marginLeft: "10px" }}>{questionSoundText}</span>
                                 :
                                 <span>{questionOnlyText}</span>
                           }
                        </div>
                     </>
                     : <>
                     </>
            }
            <div className="quesOptionContainer">
               <div className='rowContainer' style={totalOptions >= 3 ? { flexWrap: "wrap" } : {}}>
                  <div className="optionContainer">
                     <img src={o1} alt='' className="option" style={o1 === undefined ? { minHeight: "120px" } : {}} />
                     <input type="radio" name="q1" id="a1" className='chooseOption' />
                  </div>
                  {
                     totalOptions >= 2 ?
                        <div className="optionContainer">
                           <img src={o2} alt='' className="option" style={o2 === undefined ? { minHeight: "120px" } : {}} />
                           <input type="radio" name="q1" id="a2" className='chooseOption' />
                        </div>
                        :
                        ""
                  }
                  {
                     totalOptions >= 3 ?
                        <div className="optionContainer" style={totalOptions >= 3 ? { marginLeft: "0px", marginTop: "40px" } : {}}>
                           <img src={o3} alt='' className="option" style={o3 === undefined ? { minHeight: "120px" } : {}} />
                           <input type="radio" name="q1" id="a3" className='chooseOption' />
                        </div>
                        :
                        ""
                  }
                  {
                     totalOptions >= 4 ?
                        <div className="optionContainer" style={totalOptions >= 3 ? { marginTop: "40px" } : {}}>
                           <img src={o4} alt='' className="option" style={o4 === undefined ? { minHeight: "120px" } : {}} />
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