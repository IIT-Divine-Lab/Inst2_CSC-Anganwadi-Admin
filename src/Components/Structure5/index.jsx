import React, { useEffect, useState } from 'react'
import Heading from '../../Common/Heading'
import "./style.css"
// import q2s6o1 from "../../questions/animalFruits/q2s6o1.png"
// import q2s6o2 from "../../questions/animalFruits/q2s6o2.png"
// import q2s6o3 from "../../questions/animalFruits/q2s6o3.png"
// import q2s6o4 from "../../questions/animalFruits/q2s6o4.png"
// import q2s6o5 from "../../questions/animalFruits/q2s6o5.png"
// import q2s6o6 from "../../questions/animalFruits/q2s6o6.png"
// import q2s6o7 from "../../questions/animalFruits/q2s6o7.png"
// import q2s6o8 from "../../questions/animalFruits/q2s6o8.png"
// import q2s6o9 from "../../questions/animalFruits/q2s6o9.png"
// import q2s6o10 from "../../questions/animalFruits/q2s6o10.png"
// import q2s6o11 from "../../questions/animalFruits/q2s6o11.png"
// import q2s6o12 from "../../questions/animalFruits/q2s6o12.png"
// import q2s6o13 from "../../questions/animalFruits/q2s6o13.png"
// import q2s6o14 from "../../questions/animalFruits/q2s6o14.png"
// import q2s6o15 from "../../questions/animalFruits/q2s6o15.png"
// import q2s6o16 from "../../questions/animalFruits/q2s6o16.png"
// import q2s6o17 from "../../questions/animalFruits/q2s6o17.png"
// import q2s6o18 from "../../questions/animalFruits/q2s6o18.png"
// import q2s6o19 from "../../questions/animalFruits/q2s6o19.png"
// import q2s6o20 from "../../questions/animalFruits/q2s6o20.png"

const Structure5 = ({ question, selected, handleSelection }) => {
   const [column, setColumn] = useState(0);

   // let question = {
   //    structure: 5,
   //    correctAnswer: "animals",
   //    options: [
   //       {
   //          type: "animals",
   //          img: q2s6o1
   //       },
   //       {
   //          type: "transport",
   //          img: q2s6o2
   //       },
   //       {
   //          type: "fruits",
   //          img: q2s6o3
   //       },
   //       {
   //          type: "objects",
   //          img: q2s6o4
   //       },
   //       {
   //          type: "fruits",
   //          img: q2s6o5
   //       },
   //       {
   //          type: "objects",
   //          img: q2s6o6
   //       },
   //       {
   //          type: "transport",
   //          img: q2s6o7
   //       },
   //       {
   //          type: "objects",
   //          img: q2s6o8
   //       },
   //       {
   //          type: "objects",
   //          img: q2s6o9
   //       },
   //       {
   //          type: "animals",
   //          img: q2s6o10
   //       },
   //       {
   //          type: "transport",
   //          img: q2s6o11
   //       },
   //       {
   //          type: "fruits",
   //          img: q2s6o12
   //       },
   //       {
   //          type: "fruits",
   //          img: q2s6o13
   //       },
   //       {
   //          type: "objects",
   //          img: q2s6o14
   //       },
   //       {
   //          type: "animals",
   //          img: q2s6o15
   //       },
   //       {
   //          type: "animals",
   //          img: q2s6o16
   //       },
   //       {
   //          type: "animals",
   //          img: q2s6o17
   //       },
   //       {
   //          type: "transport",
   //          img: q2s6o18
   //       },
   //       {
   //          type: "fruits",
   //          img: q2s6o19
   //       },
   //       {
   //          type: "transport",
   //          img: q2s6o20
   //       },
   //    ]
   // }

   useEffect(() => {
      if (column === 0) {
         let quotient = question.options.length / 5;
         console.log(quotient);
         setColumn(quotient);
      }
   }, [column, question])

   return (
      <>
         <Heading>
            Select the {question.correctAnswer}
         </Heading>
         <div className='s5optionContainer' style={{ gridTemplateColumns: `repeat(${column},1fr)` }}>
            {
               question.options.map((option, index) => {
                  return <div className='s5option' key={index}>
                     <div onClick={() => handleSelection(option.type + (index + 1))}>
                        <img
                           src={option.img}
                           className={selected.includes(option.type + (index + 1)) ? 'selected' : ''}
                           alt=""
                        />
                     </div>
                  </div>
               })
            }
         </div>
      </>
   )
}

export default Structure5