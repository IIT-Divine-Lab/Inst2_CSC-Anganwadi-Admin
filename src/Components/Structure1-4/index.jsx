import React from 'react'
import "./style.css"
import { HiSpeakerWave } from "react-icons/hi2";
import Heading from '../Common/Heading'
import Body from '../Common/Body';
import ParentContainer from '../Common/ParentContainer';
import Button from '../Common/Button';

const Structure1to4 = ({ view, structure, questionText, questionImageBefore, questionImageAfter, totalOptions = 4, options, questionOnlyText, questionSound, questionSoundText, enabledText, enabledSound, correctAnswer }) => {

   const playAudio = () => {
      var aud = document.getElementById("audioQues");
      aud.play();
   }

   const getSourceURL = (obj, type = "image") => {
      try {
         if (obj && type === "audio") {
            let blobData = obj;
            if (typeof (obj) === "string") {
               blobData = new Uint8Array(obj.split(","))
            }
            else if (typeof (obj?.filePath) === "object") {
               blobData = new Uint8Array(obj.filePath.data)
            }
            const blob = new Blob([blobData], { type: "audio/mp3" });
            return URL.createObjectURL(blob);
         }
         if (typeof (obj?.filePath) === "object") {
            let bufferURL = URL.createObjectURL(new Blob([new Uint8Array(obj.filePath.data)], { type: "image/png" }))
            return bufferURL;
         }
         return URL.createObjectURL(obj)
      }
      catch (error) {
         return `data:image/png;base64,${obj?.filePath}`
      }
   }

   return (
      <ParentContainer view={view ? 0.75 : false}>
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
                     <img src={options !== undefined ? getSourceURL(options[0]) : undefined} alt='' className={correctAnswer && correctAnswer[0] === "1" ? "option optionActive" : "option"} style={options === undefined ? { minHeight: "120px", backgroundColor: "#cacaca" } : {}} />
                     <input type="radio" name="q1" id="a1" className='chooseOption' />
                  </div>
                  {
                     totalOptions >= 2 ?
                        <div className="optionContainer">
                           <img src={options !== undefined ? getSourceURL(options[1]) : undefined} alt='' className={correctAnswer && correctAnswer[0] === "2" ? "option optionActive" : "option"} style={options === undefined ? { minHeight: "120px", backgroundColor: "#cacaca" } : {}} />
                           <input type="radio" name="q1" id="a2" className='chooseOption' />
                        </div>
                        :
                        ""
                  }
                  {
                     totalOptions >= 3 ?
                        <div className="optionContainer" style={totalOptions >= 3 ? { marginLeft: "0px", marginTop: "40px" } : {}}>
                           <img src={options !== undefined ? getSourceURL(options[2]) : undefined} alt='' className={correctAnswer && correctAnswer[0] === "3" ? "option optionActive" : "option"} style={options === undefined ? { minHeight: "120px", backgroundColor: "#cacaca" } : {}} />
                           <input type="radio" name="q1" id="a3" className='chooseOption' />
                        </div>
                        :
                        ""
                  }
                  {
                     totalOptions >= 4 ?
                        <div className="optionContainer" style={totalOptions >= 3 ? { marginTop: "40px" } : {}}>
                           <img src={options !== undefined ? getSourceURL(options[3]) : undefined} alt='' className={correctAnswer && correctAnswer[0] === "4" ? "option optionActive" : "option"} style={options === undefined ? { minHeight: "120px", backgroundColor: "#cacaca" } : {}} />
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