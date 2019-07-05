import React from "react";

const CheckBox = props =>{
    const style = {
        float:"right"
    }
    return(
        <div>
            <input
                key={props.id}
                id={props.id}
                onChange={props.handleCheckbox}
                checked={props.checked}
                type="checkbox"
                className={"form-checkbox-input"}
            />
            <label htmlFor={props.name}>{props.title}</label>
            <label htmlFor="reminder">{props.reminder}</label>
            <label style={style}>
                 <i className={props.value.length!==0&&!props.isEdited&&props.checked?"fas fa-check-circle":
                (props.value.length===0&&props.checked?"fas fa-question-circle":
                (props.isEdited&&props.checked?"fas fa-exclamation-circle":
                (!props.checked?"fas fa-circle":"")))}>
                 </i> 
            </label>
        </div>
    )
}

export default CheckBox