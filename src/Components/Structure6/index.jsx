import React from 'react'
import './style.css'
import Heading from '../Common/Heading'
import Body from '../Common/Body'
import Button from '../Common/Button'
import ParentContainer from '../Common/ParentContainer'

const Structure6 = ({ view, activeOption, active, inactive, answerImage, questionText, questionImageAfter }) => {
   
   const getSourceURL = (obj) => {
      try {
         console.log(obj);
         if(obj !== undefined){
            if (typeof (obj?.filePath) === "object") {
               let bufferURL = URL.createObjectURL(new Blob([new Uint8Array(obj.filePath.data)], { type: "image/png" }))
               return bufferURL;
            }
            return URL.createObjectURL(obj);
         }
         return undefined
      }
      catch (error) {
         console.log("Error", error);
         return `data:image/png;base64,${obj?.filePath}`
      }
   }

   return (
      <ParentContainer view={view ? 0.8 : false}>
         <Heading>
            {questionText !== "" ? questionText : "Your question text will appear."}
         </Heading>
         <Body>
            <div style={!questionImageAfter ? { backgroundColor: "#cacaca", width: "100%", minHeight: "300px" } : {}}>
               <img className='quesImage' src={getSourceURL(questionImageAfter)} alt="" />
            </div>
            <div className="s2OptionImage">
               <img src={getSourceURL(answerImage)} style={!answerImage ? { backgroundColor: "#cacaca", width: "500px", minHeight: "300px" } : {}} alt="" />
               <div className="options">
                  <img className='egg' style={!inactive ? { backgroundColor: "#6a6a6a", width: "50px", minHeight: "70px" } : {}} src={activeOption === "1" ? active !== undefined ? getSourceURL(active) : undefined : inactive !== undefined ? getSourceURL(inactive) : undefined} alt="" />
                  <img className='egg' style={!inactive ? { backgroundColor: "#6a6a6a", width: "50px", minHeight: "70px" } : {}} src={activeOption === "2" ? active !== undefined ? getSourceURL(active) : undefined : inactive !== undefined ? getSourceURL(inactive) : undefined} alt="" />
                  <img className='egg' style={!inactive ? { backgroundColor: "#6a6a6a", width: "50px", minHeight: "70px" } : {}} src={activeOption === "3" ? active !== undefined ? getSourceURL(active) : undefined : inactive !== undefined ? getSourceURL(inactive) : undefined} alt="" />
                  <img className='egg' style={!inactive ? { backgroundColor: "#6a6a6a", width: "50px", minHeight: "70px" } : {}} src={activeOption === "4" ? active !== undefined ? getSourceURL(active) : undefined : inactive !== undefined ? getSourceURL(inactive) : undefined} alt="" />
               </div>
            </div>
         </Body>
         <Button>Next</Button>
      </ParentContainer>
   )
}

export default Structure6