import React from 'react'

const ParentContainer = (props) => {

   const questionStructure = {
      width: props.view ? "850px" : "100%",
      minHeight: props.view ? "80vh" : "",
      height: props.view ? "80vh" : "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
   }

   const questionSubStructure = {
      transform: props.view ? `scale(${props.view})` : "",
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