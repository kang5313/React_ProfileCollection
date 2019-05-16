import React from "react"
const Input = props=>{
    return(
        <div className="form-group">
            <input 
                type={props.type}
                className="form-control"
                id={props.key}
                name={props.name}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.handleChange}
                disabled={props.disabled}
                required={true}
                {...props}
            />
        </div>
    )
}

export default Input