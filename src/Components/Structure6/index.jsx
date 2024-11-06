import React from 'react'
import './style.css'
import Heading from '../Common/Heading'
import Body from '../Common/Body'
import Button from '../Common/Button'
// import active from "./active.png"
// import inactive from "./inactive.png"
// import answerImage from "./ans.png"

const Structure6 = ({ activeOption, active, inactive, answerImage, questionText, questionImageAfter, question }) => {
   return (
      <>
         <Heading>
            {questionText !== "" ? questionText : "Your question text will appear."}
         </Heading>
         <Body>
            <div style={!questionImageAfter ? { backgroundColor: "#cacaca", width: "100%", minHeight: "300px" } : {}}>
               <img className='quesImage' src={questionImageAfter} alt="" />
            </div>
            <div className="s2OptionImage">
               <img src={answerImage} style={!answerImage ? { backgroundColor: "#cacaca", width: "500px", minHeight: "300px" } : {}} alt="" />
               <div className="options">
                  <img className='egg' style={!inactive ? { backgroundColor: "#6a6a6a", width: "50px", minHeight: "70px" } : {}} src={activeOption === "o1" ? active : inactive} alt="" />
                  <img className='egg' style={!inactive ? { backgroundColor: "#6a6a6a", width: "50px", minHeight: "70px" } : {}} src={activeOption === "o2" ? active : inactive} alt="" />
                  <img className='egg' style={!inactive ? { backgroundColor: "#6a6a6a", width: "50px", minHeight: "70px" } : {}} src={activeOption === "o3" ? active : inactive} alt="" />
                  <img className='egg' style={!inactive ? { backgroundColor: "#6a6a6a", width: "50px", minHeight: "70px" } : {}} src={activeOption === "o4" ? active : inactive} alt="" />
               </div>
            </div>
         </Body>
         <Button>Next</Button>
      </>
   )
}

export default Structure6