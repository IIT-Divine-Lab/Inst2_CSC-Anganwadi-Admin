import React from 'react'
import "./style.css"
import { HiSpeakerWave } from "react-icons/hi2";
import Heading from '../Common/Heading'
import Body from '../Common/Body';
import ParentContainer from '../Common/ParentContainer';
import Button from '../Common/Button';

const Structure1to4 = ({ view, structure, questionText, questionImageBefore, questionImageAfter, totalOptions = 4, option, questionOnlyText, questionSound, questionSoundText, enabledText, enabledSound, correctAnswer }) => {

   const playAudio = () => {
      var aud = document.getElementById("audioQues");
      aud.play();
   }
   // console.log("option at 15", option)
   const getSourceURL = (obj, type = "image") => {
      // console.log("get source url : ", obj)
      console.log(option, type);
      try {
         if (obj && type === "audio") {
            let blobData = obj;
            if (typeof (obj) === "string") {
               console.log(obj.split(","))
               blobData = new Uint8Array(obj.split(","))
            }
            console.log(obj);
            console.log(blobData);
            console.log(typeof (obj), typeof (blobData));
            const blob = new Blob([blobData], { type: "audio/mp3" });
            console.log(blob);
            return URL.createObjectURL(blob);
         }
         return URL.createObjectURL(obj)
      }
      catch (error) {
         return `data:image/png;base64,${obj?.filePath}`
      }
   }

   return (
      <ParentContainer view={view ? 0.5 : false}>
         {
            structure === 1 ?
               questionImageBefore !== undefined ?
                  <div>
                     <img className='quesImageBefore' style={questionImageAfter !== undefined ? { height: "auto", backgroundColor: "transparent" } : { background: "transparent" }} src={questionImageBefore !== undefined ? getSourceURL(questionImageBefore) : undefined} alt="" />
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
                        <img style={structure === 2 ? { height: "300px", width: "auto", backgroundColor: "transparent" } : { backgroundColor: "transparent", border: "none" }} className='quesImageAfter' src={questionImageAfter !== undefined ? getSourceURL(questionImageAfter) : undefined} alt="" />
                     </div>
                     :
                     <div style={{ minHeight: "120px" }} className='quesImageAfter'></div>
                  : structure === 4 ?
                     <>
                        {
                           enabledSound === true ?
                              <audio loops={false} id='audioQues' className='audioQues' src={questionSound !== undefined ? getSourceURL(questionSound, "audio") : undefined}></audio>
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
                     <img src={option !== undefined ? getSourceURL(option[0]) : undefined} alt='' className={correctAnswer && correctAnswer[0] === "o1" ? "option optionActive" : "option"} style={option === undefined ? { minHeight: "120px", backgroundColor: "#cacaca" } : {}} />
                     <input type="radio" name="q1" id="a1" className='chooseOption' />
                  </div>
                  {
                     totalOptions >= 2 ?
                        <div className="optionContainer">
                           <img src={option !== undefined ? getSourceURL(option[1]) : undefined} alt='' className={correctAnswer && correctAnswer[0] === "o2" ? "option optionActive" : "option"} style={option === undefined ? { minHeight: "120px", backgroundColor: "#cacaca" } : {}} />
                           <input type="radio" name="q1" id="a2" className='chooseOption' />
                        </div>
                        :
                        ""
                  }
                  {
                     totalOptions >= 3 ?
                        <div className="optionContainer" style={totalOptions >= 3 ? { marginLeft: "0px", marginTop: "40px" } : {}}>
                           <img src={option !== undefined ? getSourceURL(option[2]) : undefined} alt='' className={correctAnswer && correctAnswer[0] === "o3" ? "option optionActive" : "option"} style={option === undefined ? { minHeight: "120px", backgroundColor: "#cacaca" } : {}} />
                           <input type="radio" name="q1" id="a3" className='chooseOption' />
                        </div>
                        :
                        ""
                  }
                  {
                     totalOptions >= 4 ?
                        <div className="optionContainer" style={totalOptions >= 3 ? { marginTop: "40px" } : {}}>
                           <img src={option !== undefined ? getSourceURL(option[3]) : undefined} alt='' className={correctAnswer && correctAnswer[0] === "o4" ? "option optionActive" : "option"} style={option === undefined ? { minHeight: "120px", backgroundColor: "#cacaca" } : {}} />
                           <input type="radio" name="q1" id="a4" className='chooseOption' />
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