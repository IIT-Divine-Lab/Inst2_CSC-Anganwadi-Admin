import React, { useEffect, useState } from 'react'
import Heading from '../Common/Heading'
import "./style.css"
import Button from '../Common/Button';
import ParentContainer from '../Common/ParentContainer';

const Structure5 = ({ view, options = [], totalOptions, questionText, selected }) => {
   const [column, setColumn] = useState(2);
   // console.log(options);
   // console.log(totalOptions);

   // console.log("option at 15", option)
   const getSourceURL = (obj, type = "image") => {
      // console.log("get source url : ", obj)
      console.log(options, type);
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

   useEffect(() => {
      let quotient = totalOptions / 5;
      console.log(selected);
      setColumn(quotient);
   }, [totalOptions, selected])

   return (
      <ParentContainer view={view ? 0.65 : false}>
         <Heading>
            {questionText !== "" ? questionText : "Your question text will appear."}
         </Heading>
         <div className='s5optionContainer' style={{ gridTemplateColumns: `repeat(${column},1fr)`, gap: options["o1"] === undefined ? "20px" : 0 }}>
            {
               Array.from({ length: totalOptions ? totalOptions : 10 }, (_, i) => (
                  <div className='s5option' style={options["o" + (i)] === undefined ? { backgroundColor: "#cacaca" } : {}} key={i}>
                     <div>
                        <img
                           src={getSourceURL(options[(i)])}
                           className={selected[selected.findIndex((val) => val?.value === ((i)))]?.value === ((i)) || selected.includes((i)) ? 'selected' : ''}
                           alt=""
                        />
                     </div>
                  </div>

               ))
            }
         </div>
         <Button>Next</Button>
      </ParentContainer>
   )
}

export default Structure5