import React, { useEffect, useState } from 'react'
import Heading from '../Common/Heading'
import "./style.css"
import Button from '../Common/Button';
import ParentContainer from '../Common/ParentContainer';

const Structure5 = ({ view, options = [], totalOptions, questionText, selected }) => {
   const [column, setColumn] = useState(2);
   // console.log(options);
   // console.log(totalOptions);

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
                  <div className='s5option' style={options["o" + (i + 1)] === undefined ? { backgroundColor: "#cacaca" } : {}} key={i}>
                     <div>
                        <img
                           src={options["o" + (i + 1)]}
                           className={selected[selected.findIndex((val) => val?.value === ("o" + (i + 1)))]?.value === ("o" + (i + 1)) || selected.includes("o" + (i + 1)) ? 'selected' : ''}
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