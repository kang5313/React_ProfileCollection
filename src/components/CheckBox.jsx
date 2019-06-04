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
            <label style={style}> <i className={props.checked&&!props.isEdited?"fas fa-check-circle":(props.checked&&props.isEdited?"fas fa-exclamation-circle":"fas fa-times-circle")}></i> </label>
        </div>
    )
}

export default CheckBox