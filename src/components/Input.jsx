import React from "react"
const Input = props=>{
    return(
        <div className="form-group">
            <input 
                id={props.id}
                type={props.type}
                className="form-control"
                name={props.name}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.handleChange}
                disabled={props.disabled}
                required={true}
            />
        </div>
    )
}

export default Input