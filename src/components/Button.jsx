import React from "react"

const style={width:"15em",marginLeft:"0.5em"}
const Button = props =>{
    return(
        <button
            className={props.name}
            onClick={props.handleSelectAll}
            checked={props.checked}
            style={style}
        >
            {props.title}
        </button>
    )
}

export default Button;