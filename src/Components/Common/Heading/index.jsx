import React from 'react'

const Heading = (props) => {

   const quesHead = {
      textAlign: "center",
      fontSize: "28px",
      lineHeight: "36px"
   }

   return (
      <div>
         <h3 style={quesHead}>
            {props.children}
         </h3>
      </div>
   )
}

export default Heading