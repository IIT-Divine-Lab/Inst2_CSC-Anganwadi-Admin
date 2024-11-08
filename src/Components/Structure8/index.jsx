import React from 'react'
import "./style.css"
import Heading from '../Common/Heading'
import Body from '../Common/Body';
import ParentContainer from '../Common/ParentContainer';
import Button from '../Common/Button';

const Structure8 = ({ view, questionText, questionImageAfter }) => {

   return (
      <ParentContainer view={view ? 0.5 : false}>
         <Heading>
            {questionText !== "" ? questionText : "Your question text will appear."}
         </Heading>
         <Body>
            <div>
               <img style={{ height: "300px", width: "auto", minWidth: "400px", backgroundColor: "transparent" }} className='quesImageAfter' src={questionImageAfter} alt="" />
            </div>
            <div style={{ marginTop: "20px", height: "350px", width: "500px", backgroundColor: "#cacaca", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "28px", fontWeight: "bold" }}>
               CANVAS HERE
            </div>
         </Body>
         <Button>
            Next
         </Button>
      </ParentContainer>
   )
}

export default Structure8