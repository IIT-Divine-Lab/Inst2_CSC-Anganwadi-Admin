import React, { useEffect, useState } from 'react'
import Heading from '../Common/Heading'
import "./style.css"
import Button from '../Common/Button';
import ParentContainer from '../Common/ParentContainer';

const Structure5 = ({ view, options = [], totalOptions, questionText, selected }) => {
   const [column, setColumn] = useState(2);
   const getSourceURL = (obj, type = "image") => {
      try {
         if (typeof (obj?.filePath) === "object") {
            let bufferURL = URL.createObjectURL(new Blob([new Uint8Array(obj.filePath.data)], { type: "image/png" }))
            return bufferURL;
         }
         return URL.createObjectURL(obj);
      }
      catch (error) {
         return `data:image/png;base64,${obj?.filePath}`
      }
   }

   useEffect(() => {
      let quotient = totalOptions / 5;
      setColumn(quotient);
   }, [totalOptions, selected])

   return (
      <ParentContainer view={view ? 0.7 : false}>
         <Heading>
            {questionText !== "" ? questionText : "Your question text will appear."}
         </Heading>
         <div className='s5optionContainer' style={{ gridTemplateColumns: `repeat(${column},1fr)`, gap: options[1] === undefined ? "20px" : 0 }}>
            {
               Array.from({ length: totalOptions ? totalOptions : 10 }, (_, i) => (
                  <>
                     <div
                        className='s5option'
                        style={options[(i)] === undefined ? { backgroundColor: "#cacaca" } : {}}
                        key={i}
                     >
                        <div
                           className={
                              selected[selected?.findIndex((val) => val?.value === i)]?.value === i
                                 ||
                                 selected[selected?.findIndex((val) => Number(val?.value) === i)]
                                 ? 'selected' : ''
                           }
                           style={
                              options[(i)] !== undefined
                                 ? { marginBottom: "14px", marginLeft: i % 2 ? "14px" : 0, height: "unset", width: "unset" }
                                 : {}}
                        >
                           <img
                              src={getSourceURL(options[(i)])}
                              alt=""
                           />
                        </div>
                     </div>
                  </>

               ))
            }
         </div>
         <Button>Next</Button>
      </ParentContainer>
   )
}

export default Structure5