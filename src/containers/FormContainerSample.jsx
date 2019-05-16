import React,{Component} from "react"
import Input from "../components/Input"
import Select from "../components/Select"
import CheckBox from "../components/CheckBox"
import TextArea from "../components/TextArea"
import Button from "../components/Button"
import FormErrors from '../components/FormErros'
import "../FormContainer.css"

const initialState = {
    name:"",
    age:"",
    gender:"",
    skills:[],
    about:""
}


class FormContainer extends Component{
    constructor(props){
        super(props)
        this.state={
            newUser:initialState,
            formErrors:{
                name:"",
                about:""
            },
            nameValid:false,
            aboutValid:false,
            genderOptions:["Male","Female","Others"],
            skilsOptions:["C++","Java","JavaScript","Python"]
        }
    }

    handleInput = (event) =>{
        let value = event.target.value
        let name = event.target.name

        this.setState(
            prevState=>({
                newUser:{
                        ...prevState.newUser,
                        [name]:value
                },
            }),()=>{this.validateField(name,value)}
        )
    }

    validateField(fieldName,value){
        let fieldValidationErrors = this.state.formErrors
        let nameValid = this.state.nameValid
        let aboutValid = this.state.aboutValid

        switch(fieldName){
            case 'name':
                nameValid = value.length>=6
                fieldValidationErrors.name = nameValid?'':'is too short'
                break
            case 'aboutValid':
                aboutValid = value.length>=6
                fieldValidationErrors.name = aboutValid?'':'is too short'
                break
            default:
                break
        }
        this.setState(
                {formErrors:fieldValidationErrors,
                nameValid:nameValid,
                aboutValid:aboutValid})

        }
    

    handleCheckbox = (event) =>{
        let newSelection = event.target.value
        let newSelectionArray
        if(this.state.newUser.skills.indexOf(newSelection)>-1)
        {
            newSelectionArray = this.state.newUser.skills.filter(
                s=>s!==newSelection
            )
        }else{
            newSelectionArray = [...this.state.newUser.skills,newSelection]
        }

        this.setState(
            prevState=>({
                newUser:{...prevState.newUser,skills:newSelectionArray}
            })
        )
    }

    handleSubmit=(event)=>{
        event.preventDefault()
        let userData = this.state.newUser

        console.log(userData)
        var url = "http://localhost:8000"
        var xhr = new XMLHttpRequest()
        xhr.open("POST",url,true)
        xhr.send(JSON.stringify(userData));
        xhr.onload = function(){
            window.location.href="http://localhost:8000/"+xhr.responseText
        }

        this.setState({
            newUser:initialState
        })
    }

    handleClearForm=(event)=>{
        event.preventDefault()
        this.setState({
            newUser:initialState
        })
    }

    render(){
        return(
            <form className="container-fluid">
                <Input 
                    type={"text"}
                    title={"Full name"}
                    name={"name"}
                    value={this.state.newUser.name}
                    placeholder={"Enter Your Name"}
                    handleChange={this.handleInput}
                    required
                />{" "}

                <Input
                    type={"number"}
                    title={"Age"}
                    name={"age"}
                    value={this.state.newUser.age}
                    placeholder={"Enter Your Age"}
                    handleChange={this.handleInput}
                />{" "}
                
                <Select
                    title={"Gender"}
                    name={"gender"}
                    options={this.state.genderOptions}
                    value={this.state.newUser.gender}
                    placeholder={"Select Gender"}
                    handleChange={this.handleInput}
                />
                <CheckBox
                    title={"Skills"}
                    name={"skills"}
                    options={this.state.skilsOptions}
                    selectedOptions={this.state.newUser.skills}
                    handleChange={this.handleCheckbox}
                />{" "}
                <TextArea
                    title={"About"}
                    name={"about"}
                    row={10}
                    cols={50}
                    value={this.state.newUser.about}
                    placeholder={"Describe about your experiences and skills"}
                    handleChange={this.handleInput}
                />

                <div className="panel panel-default">
                    <FormErrors formErrors={this.state.formErrors}/>
                </div>

                <Button 
                    action={this.handleSubmit}
                    type={"primary"}
                    title={"Submit"}
                />{" "}

                <Button 
                    action={this.handleClearForm}
                    type={"secondary"}
                    title={"Clear"}
                />{" "}

            </form>
        )
    }
}

export default FormContainer