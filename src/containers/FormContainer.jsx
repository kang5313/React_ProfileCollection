import React from 'react'
import profileInfoCollection from '../components/profileInfoCollection'
import Select from '../components/Select'
import Input from '../components/Input'
import CheckBox from "../components/CheckBox"
import SubmitButton from "../components/SubmitButton"
import Button from "../components/Button"
import update from "immutability-helper"
import * as multi from "../components/multiSelectedValue"
import * as helper from "../components/helperFunctions.js"

async function input (profileInfo,event){
    const {id,value,type,checked} = event.target
        let profileData = []
        if (type === "select-one" || type === "text")  
        {
            profileData = await update(profileInfo,{[id]:{selectedValue:{$set:value},isEdited:{$set:true}}})
        }
        else if(type === "checkbox")
        {
            profileData = await update(profileInfo,{[id]:{checked:{$set:checked}}})
        }
        else if (type === "select-multiple")
        {
            profileData = profileInfo[id].selectedValue.includes(value)?
                          await update(profileInfo,{[id]:{selectedValue:{$splice:[[profileInfo[id].selectedValue.indexOf(value),1]]},isEdited:{$set:true}}}):
                          await update(profileInfo,{[id]:{selectedValue:{$push:[value]},isEdited:{$set:true}}})
        }
        return profileData
}

class FormContainer extends React.Component{
    constructor(props){
        super(props)
        this.state={
            profileInfo:[],
            selectedVersion:"",
            versionOptions:["3.6.0","3.6.1","3.7.0","3.10.0","3.10.1","3.11.0","3.11.1","3.11.2"],
            profileName:"",
            disabled:false,
            fileImported:"",
            selectedAll:false
        }
    }
    /*  This function handles the selection of versions. 
        The profileInfoCollection will be mapped and compareVersion function will be called to filter the profile to be selected.
    */
    handleVersion = (event) =>{
        event.preventDefault()
        let value = event.target.value
        let name = event.target.name
        let profileOptions = []

        //the profile is available for this version
        profileInfoCollection
        .filter(profile=>helper.compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)>=0)
        .forEach(profile=>
        {
            if(this.state.fileImported!=="")
            {
                let exist = false
                this.state.profileInfo.forEach(currentStateProfile=>{
                    if(currentStateProfile.variableName === profile.variableName){
                        exist = true
                    }
                })
                if(!exist){profile.checked =true}
            }
            else{
                profile.checked =true
            }
            
            // the profile is only available from the mentioned child version of this version
            if(helper.compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)===2) 
            {
                profile.stringToDisplay = "support from "+profile.startAvailableVersion+" onwards."
            }
            else
            {
                profile.stringToDisplay = ""
            }
            profile.isMultiSelected = (multi.multiSelectedProfile.includes(profile.variableName))?true:false
            profileOptions.push(profile)
        })

        this.setState({
                profileInfo:profileOptions,
                [name]:value
            }
        )
    }
    
    //This function handles user input and change the corresponding data in profileInfoCollection according to the input type.
    handleInput = (event) =>{
        input(this.state.profileInfo,event)
        .then(profileData =>{
            this.setState({
                profileInfo:profileData
            })}
        )
    }

    handleSubmit = (event) =>{
        let profileData = this.state.profileInfo
        let fetchBody = []
        for(var i = this.state.profileInfo.length-1;i>=0;i--){
            if(this.state.profileInfo[i].checked===false){
                profileData = update(profileData,{$splice:[[i,1]]})
            }
        }
        fetchBody.push(profileData)
        fetchBody.push(this.state.selectedVersion)
        fetchBody.push(this.state.profileName)
        let url = "http://localhost:8000"
        let fetchData = {
            method: 'POST',
            body: JSON.stringify(fetchBody),
            mode:'cors',
            headers: new Headers()
        }
        helper.fetchDataToBackend(url,fetchData)
        .then(filename=>{
            window.open(url+"/xml/"+filename)
        })
        document.getElementById("xmlFileToUpload").value=""
        document.getElementById("tsvFileToUpload").value=""
        event.preventDefault();
        this.setState({ 
            profileInfo: [],
            selectedVersion:"",
            profileName:""
        })
    }

    /*  User imports tprof file. Based the techflow version in tprof file import the relevant profile into the form.
        Should be updated to import profile according to the profile name in the xml
    */
    importTPROFFile = (event) => {
        let profileOptionsFromFile = []
        let i = 0
        let profileValue
        let temp_list = {}
        let profileVariableName = []
        let fileName = event.target.value
        let allowed_extensions = new Array("tprof");

        /* split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. 
        If there will be no extension then it will return the filename.*/
        let file_extension = fileName.split('.').pop().toLowerCase();

            if(allowed_extensions[i] === file_extension)
            {
                helper.readTPROF(event)
                .then(importedData => {
                    importedData["value"].forEach(profile=>{
                        profileVariableName.push(profile["name"])
                    })
                    profileOptionsFromFile = helper.loadProfileVariableFromFile(profileVariableName,importedData["selectedTechFlowVersion"],allowed_extensions[i])
                    profileOptionsFromFile.filter(profile => profile.checked === true).forEach(profile => {
                        if(multi.multiSelectedProfile.includes(profile.variableName)){
                            profileValue = (importedData["value"][i]["variableValue"]).split(",")
                        }
                        else{
                            profileValue = importedData["value"][i]["variableValue"]
                        }
                        profile.selectedValue = profileValue
                        profile.isEdited = false
                        i++
                    })                    
                    temp_list = JSON.parse(JSON.stringify(profileOptionsFromFile))  //for backup data
                    document.getElementById("tsvFileToUpload").value = ""
                    this.setState({
                        selectedVersion:importedData["selectedTechFlowVersion"],
                        profileName:importedData["profileName"],
                        profileInfo:profileOptionsFromFile,
                        fileImported:importedData["fileImported"],
                        backupData:temp_list,
                        backupImportedVersion:importedData["selectedTechFlowVersion"]
                    })})
            }
            else{
                window.alert("This file type is not supported")
                document.getElementById("xmlFileToUpload").value=""
                document.getElementById("tsvFileToUpload").value=""
                this.setState({
                    selectedVersion:"",
                    profileName:"",
                    profileInfo:[],
                    fileImported:""
                })
            }
    }

    /*  Import data from the uploaded TSV file and populate into the form
        After the data is loaded from the TSV file, there are few conditions for handling the loaded data.

        First , If the profile info input type is SELECT and (&&) the loaded profile value is appropriate (found in the supported value array) or (||) the imported profile is multiple
         or (||) the input type is text -----(1), then the position of current profile in the profile array is checked.----(2)

            If the imported profile is with multieple selection , then check whether it's a paired profileInfo(with .IfParentNotFound)
                If the imported selectedValueis supported then set the value , else left it blank - (5)
            Else repeat (5)
        
            If the current profile is the last element in the array , then the profile selectedValue will be set to the loaded profile value,
            Else , check if the next profile name is in the format of ("current profile name".IfParentNotFound) then the current profile selectedValue will be set to Inherit and the next profile selectedValue will be set to the loaded value.---(3)

        Else (for (1) condition ), the loaded profile value is found to be inappropriate (not found in the supported value array),
        then the current profile and next profile(under the condition if next profile name is in the format mentioned above) is set to empty ("")

        After populate, a set of deep copied backup and the techFlow version backup are saved to perform the reset function
    */
    importTSVFile = (event) =>{
        let i = 0
        let fileName = event.target.value
        var allowed_extensions = new Array("tsv")
        var file_extension = fileName.split('.').pop().toLowerCase()
        let temp_list = []
        let profileOptionsFromFile = []
        let valueIndex  = 0

        if(allowed_extensions[i]===file_extension){
            helper.readTSV(event)
            .then(importedData =>{
                profileOptionsFromFile = helper.loadProfileVariableFromFile("",importedData["selectedTechFlowVersion"],allowed_extensions[i])
                let profileSequence = importedData["profileSequence"]
                profileSequence.forEach(profileIndex=>{
                    
                    if(((profileOptionsFromFile[profileIndex].type==="select")
                        &&((profileOptionsFromFile[profileIndex].supportedValue).includes(importedData["value"][valueIndex]["variableValue"])||importedData["value"][valueIndex]["isMultiSelected"]))
                        ||(profileOptionsFromFile[profileIndex].type==="text"&&profileOptionsFromFile[profileIndex].selectedValue!==""))
                    {    
                        if(importedData["value"][valueIndex]["isMultiSelected"]){
                            profileOptionsFromFile[profileIndex].isMultiSelected = true
                            if((importedData["value"][valueIndex]["isPairedMulti"])){
                                profileOptionsFromFile[profileIndex+1].isMultiSelected = true
                                if((importedData["value"][valueIndex]["variableValue"]).every(value=>(profileOptionsFromFile[profileIndex+1].supportedValue).includes(value))){
                                    profileOptionsFromFile[profileIndex].selectedValue = ["Inherit"]
                                    profileOptionsFromFile[profileIndex+1].selectedValue = importedData["value"][valueIndex]["variableValue"]
                                    profileOptionsFromFile[profileIndex].isEdited = false
                                    profileOptionsFromFile[profileIndex+1].isEdited = false
                                    valueIndex++
                                    return
                                }

                                profileOptionsFromFile[profileIndex].selectedValue = []
                                profileOptionsFromFile[profileIndex+1].selectedValue = []
                                valueIndex++
                                return
                            }
                            if((importedData["value"][valueIndex]["variableValue"]).every(value=>(profileOptionsFromFile[profileIndex].supportedValue).includes(value))){
                                profileOptionsFromFile[profileIndex].selectedValue = importedData["value"][valueIndex]["variableValue"]
                                valueIndex++
                                return
                            }
                            else{
                                profileOptionsFromFile[profileIndex].selectedValue = []
                                valueIndex++
                                return
                            }
                        }
                        profileOptionsFromFile[profileIndex].selectedValue = importedData["value"][valueIndex]["variableValue"]
                        profileOptionsFromFile[profileIndex].isEdited = false
                        if(profileIndex!==profileOptionsFromFile.length-1&&(profileOptionsFromFile[profileIndex+1].variableName)===(profileOptionsFromFile[profileIndex].variableName).concat(".IfParentNotFound")){
                                profileOptionsFromFile[profileIndex].selectedValue = "Inherit"
                                profileOptionsFromFile[profileIndex+1].selectedValue = importedData["value"][valueIndex]["variableValue"]
                                profileOptionsFromFile[profileIndex].isEdited = false
                                profileOptionsFromFile[profileIndex+1].isEdited = false
                        }
                    }
                    else{
                        profileOptionsFromFile[profileIndex].selectedValue = ""
                        profileOptionsFromFile[profileIndex].checked = false
                        if(profileIndex!==profileOptionsFromFile.length-1
                            &&(profileOptionsFromFile[profileIndex+1].variableName)===(profileOptionsFromFile[profileIndex].variableName).concat(".IfParentNotFound"))
                        {
                            profileOptionsFromFile[profileIndex+1].selectedValue = ""
                            profileOptionsFromFile[profileIndex+1].checked = false
                        }
                    }
                    valueIndex++
                })
                temp_list = JSON.parse(JSON.stringify(profileOptionsFromFile)) //temp_list as a backup data for RESET function
                document.getElementById("xmlFileToUpload").value=""
                this.setState({
                    selectedVersion:importedData["selectedTechFlowVersion"].trim(),
                    profileName:importedData["profileName"].trim(),
                    profileInfo:profileOptionsFromFile,
                    fileImported:importedData["fileImported"],
                    backupData:temp_list,
                    backupImportedVersion:importedData["selectedTechFlowVersion"].trim()
                })
            })
        }
        /* Error handling for the inappropriate file type*/
        else{
            window.alert("This file type is not supported")
            document.getElementById("xmlFileToUpload").value=""
            document.getElementById("tsvFileToUpload").value=""
            this.setState({
                selectedVersion:"",
                profileName:"",
                profileInfo:[],
                fileImported:""
            })
        }
    }

    handleProfileName = (event) =>{
        const {value,name} = event.target
        this.setState({
            [name]:value
        })
    }

    selectAll = (event) =>{
        event.preventDefault()
        let checked = event.target.checked
        let profileData = []
        this.state.profileInfo.forEach(profile=>{
                let newProfile = update(profile,{checked:{$set:checked}})  
                profileData.push(newProfile)
        })
        checked = !checked
        this.setState({
            profileInfo:profileData,
            selectedAll:checked
        })
    }

    reset = (event) =>{
        let profileOptionsFromFile = []
        let profileData = []
        event.preventDefault()
        if(this.state.fileImported!==""){
            profileOptionsFromFile = this.state.backupData
            this.setState({
                profileInfo:profileOptionsFromFile,
                selectedVersion:this.state.backupImportedVersion
            })
        }
        else{
            this.state.profileInfo.forEach(profile=>{
                let newProfile
                if(!profile.defaultValue){
                    if(profile.isMultiSelected)
                    {
                        newProfile = Object.assign({},profile,{selectedValue:[]},{checked:true})
                    } 
                    else
                    {
                        newProfile = Object.assign({},profile,{selectedValue:""},{checked:true})
                    }
                }
                else
                {
                    newProfile =Object.assign({},profile,{selectedValue:profile.defaultValue},{checked:true})
                }
                profileData.push(newProfile)
            })
            this.setState({
                profileInfo:profileData
            })
        }
    }

    render(){
        //Rendering the component based on the component's input type.
        const selectAllCBStyle = this.state.selectedVersion===""?{display:'none'}:{}
        return(    
            <form className="container-fluid" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label>Import TPROF : </label>
                    <input type="file" className ="form-control mb-5" name="xmlFile-to-upload" id="xmlFileToUpload" onInput={this.importTPROFFile} /*onChange={this.validate_fileUpload}*/></input>
                </div>
                <div className="form-group">
                    <label>Import TSV : </label>
                    <input type="file" className ="form-control mb-5" name="tsvFile-to-upload" id="tsvFileToUpload" onInput={this.importTSVFile} /*onChange={this.validate_fileUpload}*/></input>
                </div>
                <div className="form-group">
                    <label>Name : </label>
                    <Input
                        type={"text"}
                        name={"profileName"}
                        value={this.state.profileName}
                        placeholder={"<Enter the profile name>"}
                        handleChange={this.handleProfileName}
                    />
                </div>
                <label>TechFlow Version : </label>
                <Select
                    title={"Select TechFlow's Version "}
                    name={"selectedVersion"}
                    options={this.state.versionOptions}
                    value={this.state.selectedVersion}
                    placeholder={"Select Version"}
                    handleChange={this.handleVersion}
                />
                <hr/>
                <div style={selectAllCBStyle}>
                    <Button
                        id={"selectAllBtn"}
                        name={"btn btn-primary"}
                        title={this.state.selectedAll?"Select All":"Deselect All"}
                        handleSelectAll={this.selectAll}
                        checked={this.state.selectedAll}
                    />
                    <Button
                        id={"resetBtn"}
                        name={"btn btn-primary"}
                        title={"Reset"}
                        handleSelectAll={this.reset}
                    />
                </div>
                <br/>
                {this.state.profileInfo.map((profile,i)=>{
                    if(profile.type==="select"){
                        return(
                            <div key={this.state.profileInfo[i].id}>                               
                                 <label>{i+1}</label>
                                 <br/>
                                 <div className="form-group">
                                    <CheckBox
                                        id={i}
                                        handleCheckbox={this.handleInput}
                                        checked={profile.checked}
                                        title={profile.variableName}
                                        reminder={profile.stringToDisplay}
                                        isEdited={profile.isEdited}
                                        value={profile.selectedValue}
                                    />
                                    <Select
                                        id={i}
                                        name={"selectedValue"}
                                        checked={profile.checked}
                                        options={profile.supportedValue}
                                        value={profile.selectedValue}
                                        placeholder={"Select Value"}
                                        handleChange={this.handleInput}
                                        disabled={!profile.checked}
                                        isMultiple={multi.multiSelectedProfile.includes(profile.variableName)?true:false}
                                    />
                                </div>
                            </div>
                        )
                    }
                        return(
                            <div key={this.state.profileInfo[i].id}>
                                <label>{i+1} </label>
                                <br/>
                                <div className="form-group">
                                <CheckBox
                                        id={i}
                                        handleCheckbox={this.handleInput}
                                        checked={profile.checked}
                                        title={profile.variableName}
                                        reminder={profile.stringToDisplay}
                                        isEdited={profile.isEdited}
                                        value={profile.selectedValue}
                                />
                                <Input
                                    id={i}
                                    type={"text"}
                                    name={"selectedValue"}
                                    value={profile.selectedValue}
                                    checked={profile.checked}
                                    placeholder={profile.placeholder}
                                    handleChange={this.handleInput}
                                    disabled={!profile.checked}
                                />
                                </div>
                            </div>
                        )
                }
                )}
                <SubmitButton 
                    type = {"submit"}
                    name={"btn btn-primary"}
                    title={"Submit"}
                />
            </form>
        )
    }
}   

export default FormContainer