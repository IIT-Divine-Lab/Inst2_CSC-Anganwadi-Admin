import React from 'react'

const Body = (props) => {
   return (
      <div style={{ margin: "10px 0", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
         {props.children}
      </div>
   )
}

export default Body