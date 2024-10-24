import React from 'react'

const Button = (props) => {

   const submitBtn = {
      backgroundColor: "#162d3a",
      color: "white",
      padding: "15px 0",
      marginTop: "10px",
      width: "500px",
      borderRadius: "16px",
      cursor: "pointer",
      textAlign: "center",
      fontWeight: "600",
      fontSize: "24px",
      letterSpacing: "1.1px"
   }

   return (
      <div style={submitBtn}>
         {props.children}
      </div>
   )
}

export default Button