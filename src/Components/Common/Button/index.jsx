import React from 'react'

const Button = (props) => {

   const submitBtn = {
      backgroundColor: "#162d3a",
      color: "white",
      padding: "15px 0",
      marginTop: props.form ? 0 : "10px",
      width: props.form ? "200px" : "500px",
      borderRadius: "16px",
      cursor: "pointer",
      textAlign: "center",
      fontWeight: "600",
      fontSize: props.form ? "16px" : "24px",
      letterSpacing: "1.1px"
   }

   return (
      <div style={submitBtn}>
         {props.children}
      </div>
   )
}

export default Button