import React from 'react'

const ParentContainer = (props) => {

   const questionStructure = {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
   }

   const questionSubStructure = {
      minHeight: "750px",
      width: "90%",
      padding: "0 5%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
   }

   return (
      <div style={questionStructure}>
         <div style={questionSubStructure}>
            {props.children}
         </div>
      </div>
   )
}

export default ParentContainer