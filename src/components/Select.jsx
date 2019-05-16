import React from 'react'

const Select = props=>{
    return(

        <div className="form-group">
            <select
                id={props.id}
                name={props.name}
                value={props.value}
                onChange={props.handleChange}
                className="form-control"
                disabled={props.disabled}
                required={true}
            >
                <option value="" disabled>
                    {props.placeholder}
                </option>
                {props.options.map(option=>{
                        return (
                        <option value={option} key={option} label={option}>
                            {option}    
                        </option>)
                })}
            </select>
        </div>
    )
}

export default Select