import React from "react";

const CheckBox = props =>{
    return(
        <div>
            <input
                id={props.id}
                onChange={props.handleCheckbox}
                checked={props.checked}
                type="checkbox"
                className={"form-checkbox-input"}
            />
            <label htmlFor={props.name}>{props.title} : </label>
            <label htmlFor="reminder">{props.reminder}</label>
        </div>
    )
}

export default CheckBox