import React from 'react'
import "./style.css"
import Heading from '../Common/Heading'
import Body from '../Common/Body';
import ParentContainer from '../Common/ParentContainer';
import Button from '../Common/Button';

const Structure8 = ({ view, questionText, questionImageAfter }) => {

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
      <ParentContainer view={view ? 0.5 : false}>
         <Heading>
            {questionText !== "" ? questionText : "Your question text will appear."}
         </Heading>
         <Body>
            <div className=''>
               <div>
                  <img style={{ minHeight: "180px", height: "auto", minWidth: "400px", backgroundColor: "transparent" }} className='quesImageAfter !min-w-48' src={questionImageAfter !== undefined ? getSourceURL(questionImageAfter) : undefined} alt="" />
               </div>
               <div className='!min-w-[350px]' style={{ marginTop: "20px", height: "350px", width: "100%", backgroundColor: "#cacaca", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "28px", fontWeight: "bold" }}>
                  CANVAS HERE
               </div>
            </div>
         </Body>
         <Button>
            Next
         </Button>
      </ParentContainer>
   )
}

export default Structure8