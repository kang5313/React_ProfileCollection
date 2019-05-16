import React from "react"

const Button = props =>{
    return(
        <button
            className={props.name}
            type={props.type}
            disabled={props.disabled}
        >
            {props.title}
        </button>
    )
}

export default Button;