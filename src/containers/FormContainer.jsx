import React from 'react'
import profileInfoCollection from '../components/profileInfoCollection'
import Select from '../components/Select'
import Input from '../components/Input'
import CheckBox from "../components/CheckBox"
import SubmitButton from "../components/SubmitButton"
import Button from "../components/Button"
import update from "immutability-helper"

/*  A function to change all the profileInfo status to unchecked (used when importXMLfile)    */
function changeAllCheckedBoolean (loadedProfile){
    let changedProfile = [] 
    loadedProfile.forEach(profile=>{
        profile.checked = false
        changedProfile.push(profile)
    })
    return changedProfile
}

/*  This function handles the comparison of versions to determine whether the profile should be supported in this version or not
    v1 as selected version , v2 as start supporting version , v3 as end supporting version
 */
 function compareVersion(v1, v2, v3) {
    if (typeof v1 !== 'string') return false;
    if (typeof v2 !== 'string') return false;
    if (typeof v3 !== 'string') return false;
    v1 = v1.split('.');
    v2 = v2.split('.');
    v3 = v3.split('.');
    const k = Math.min(v1.length, v2.length, v3.length);
    for (let i = 0; i < k; ++ i) {
        v1[i] = parseInt(v1[i], 10);
        v2[i] = parseInt(v2[i], 10);
        v3[i] = parseInt(v3[i], 10);
        if (v1[i] > v2[i] && v1[i]<v3[i]) return 1  //if the selected version is between the start and end supporting version then it's available
        if (v1[i] < v2[i] || v1[i]>v3[i]) return -1      //else it's not available
    }
     /* After the for loop is over, 
     if v1's length is same with v2's length then both of them are exactly the same,
     else, v2 is a child version of v1.*/
    return v1.length === v2.length ? 0: 2
}

//Use the profile variable name to load the corresponding profile into object. Return the object and insert into state
function loadProfileVariableFromFile(data,value,fileType){
    let profileOptions = []
    let i = 0
    
    if(fileType === "tprof")
    {
        changeAllCheckedBoolean(profileInfoCollection).forEach(profile=>{
            if(compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)>=0){    //the profile is available for this version
                if(profile.variableName === data[i])
                {
                    profile.checked = true
                    i++
                }
                if(compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)===2)  // the profile is only available from the mentioned child version of this version 
                {profile.stringToDisplay = "support from "+profile.startAvailableVersion+" onwards."}

                else
                {profile.stringToDisplay = ""}

                profileOptions.push(profile)
            }
        })
        return profileOptions
    }
    else if (fileType === "tsv")
    {
        changeAllCheckedBoolean(profileInfoCollection).forEach(profile=>{
            if(compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)>=0)
            {
                if(compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)===2)  // the profile is only available from the mentioned child version of this version 
                {profile.stringToDisplay = "support from "+profile.startAvailableVersion+" onwards."}

                else
                {profile.stringToDisplay = ""}
                profile.checked = true
                profileOptions.push(profile)
            }
        })
        return profileOptions
    }
}

/*This function is used to parse the .tprof file in the frontend.
  A FileReader is used to read the .tprof file. The "name" and "selectedTechFlowVersion" attribute in "profile" tag , value in "variable" tag are 
  selected and store in a Javascript object(importedData). Promise is used in this function to ensure the data are completely loaded from the XML before "importedData" is returned.
*/
async function readTPROF(event){
    return new Promise((resolve,reject)=>{
        let parser = new DOMParser()
        var file = event.target.files
        var reader = new FileReader();
        reader.onload =() =>
            {
                let importedXMLData = []
                let textResult = reader.result
                let XMLResult = parser.parseFromString(textResult,"text/xml")
                let techflowVersion = XMLResult.getElementsByTagName("profile")[0].getAttribute("selectedTechFlowVersion")
                let profileName = XMLResult.getElementsByTagName("profile")[0].getAttribute("name")
                let importedXMLProfile = XMLResult.getElementsByTagName("variable")
                let importedValue = XMLResult.getElementsByTagName("value")
                for(var i=0;i<importedValue.length;i++){
                    importedXMLData.push({
                        "name":importedXMLProfile[i].getAttribute("name"),
                        "variableValue":importedValue[i].childNodes[0].nodeValue
                    })
                }
                let importedData = {
                    "value":importedXMLData,
                    "selectedTechFlowVersion":techflowVersion,
                    "profileName":profileName,
                    "fileImported":file[0].name
                }
                resolve(importedData)
            }
        if(file.length!==0) {reader.readAsText(file[0]); reader.onerror = reject}
    })
}

async function readTSV(event){
    return new Promise((resolve,reject)=>
    {
        let tsvProfileInfo = []
        let file = event.target.files
        let reader = new FileReader()
        reader.onload = () =>
        {
            let textResult = reader.result
            const lines = textResult.split('\n')
            const profileVariableName = (lines.slice(0,1)[0].split('\t')[1])
            const techFlowVersion = (lines.slice(1,2)[0].split('\t')[1])
            lines.slice(2,lines.length).forEach(line=>{
                let lineData = {"name":line.split('\t')[0],"variableValue":line.split('\t')[1]}
                tsvProfileInfo.push(lineData)
            })
            const tsvData = {
                "value":tsvProfileInfo,
                "profileName":profileVariableName,
                "selectedTechFlowVersion":techFlowVersion,
                "fileImported":file[0].name
            }
            document.getElementById("xmlFileToUpload").value=""
            resolve(tsvData)
        }
        if(file.length!==0) {reader.readAsText(file[0]); reader.onerror = reject}
    })
}

/*this function takes backend port as url parameter and the FETCH data info as data parameter.
  It return the backend generate profile xml filename after the data is fetched and processeed at backend.
*/
async function fetchDataToBackend(url,data){
    try
        {
            let response = await fetch(url,data)
            let responseData = await response.text()
            return responseData
        }
    catch(error)
        {
            window.alert(error)
        }
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
        profileInfoCollection
        .filter(profile=>compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)>=0)  //the profile is available for this version
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
            
            if(compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)===2)  // the profile is only available from the mentioned child version of this version 
            {
                profile.stringToDisplay = "support from "+profile.startAvailableVersion+" onwards."
            }
            else
            {
                profile.stringToDisplay = ""
            }
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
        const {id,value,type,checked} = event.target
        let profileData = []
        if (type === "select-one" || type === "text")  
        {
            profileData = update(this.state.profileInfo,{[id]:{selectedValue:{$set:value},isEdited:{$set:true}}})
        }
        else if(type === "checkbox")
        {
            profileData = update(this.state.profileInfo,{[id]:{checked:{$set:checked}}})
        }
        this.setState({
                profileInfo:profileData
            }
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
        fetchDataToBackend(url,fetchData)
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


    /*  User imports xml file. Based the techflow version in xml file import the relevant profile into the form.
        Should be updated to import profile according to the profile name in the xml
    */
    importTPROFFile = (event) => {
        let profileOptionsFromFile = []
        let i = 0
        let temp_list = {}
        let profileVariableName = []
        let fileName = event.target.value
        let allowed_extensions = new Array("tprof");
        let file_extension = fileName.split('.').pop().toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.

            if(allowed_extensions[i]===file_extension)
            {
                readTPROF(event)
                .then(importedData=>{
                    importedData["value"].forEach(profile=>{
                        profileVariableName.push(profile["name"])
                    })
                    profileOptionsFromFile=loadProfileVariableFromFile(profileVariableName,importedData["selectedTechFlowVersion"],allowed_extensions[i])
                    profileOptionsFromFile.filter(profile=>profile.checked === true).forEach(profile=>{
                        profile.selectedValue = importedData["value"][i]["variableValue"]
                        profile.isEdited = false
                        i++
                    })                    
                    temp_list = JSON.parse(JSON.stringify(profileOptionsFromFile))
                    document.getElementById("tsvFileToUpload").value=""
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

        First , If the profile info input type is SELECT and (&&) the loaded profile value is appropriate (found in the supported value array)
         or (||) the input type is text, then the position of current profile in the profile array is checked.
        
        If the current profile is the last element in the array , then the profile selectedValue will be set to the loaded profile value,
        Else , check if the next profile name is in the format of ("current profile name".IfParentNotFound) then the current profile selectedValue will be set to Inherit and the next profile selectedValue will be set to the loaded value.

        If the loaded profile value is found to be inappropriate (not found in the supported value array),
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

        if(allowed_extensions[i]===file_extension){
            readTSV(event)
            .then(importedData =>{
                profileOptionsFromFile = loadProfileVariableFromFile("",importedData["selectedTechFlowVersion"],allowed_extensions[i])
                for(let variableNameIndex=0,valueIndex=0;variableNameIndex<profileOptionsFromFile.length;variableNameIndex++,valueIndex++){
                    if(((profileOptionsFromFile[variableNameIndex].type==="select")&&((profileOptionsFromFile[variableNameIndex].supportedValue).includes(importedData["value"][valueIndex]["variableValue"].trim())))
                    ||profileOptionsFromFile[variableNameIndex].type==="text")
                    {
                        profileOptionsFromFile[variableNameIndex].selectedValue = importedData["value"][valueIndex]["variableValue"].trim()
                        profileOptionsFromFile[variableNameIndex].isEdited = false
                        if(variableNameIndex!==profileOptionsFromFile.length-1)
                        {
                            if((profileOptionsFromFile[variableNameIndex+1].variableName).includes(profileOptionsFromFile[variableNameIndex].variableName))
                            {
                                profileOptionsFromFile[variableNameIndex].selectedValue = "Inherit"
                                profileOptionsFromFile[variableNameIndex+1].selectedValue = importedData["value"][valueIndex]["variableValue"].trim()
                                variableNameIndex++
                                profileOptionsFromFile[variableNameIndex].isEdited = false
                                profileOptionsFromFile[variableNameIndex+1].isEdited = false
                            }
                        }
                    }
                    else
                    {
                        profileOptionsFromFile[variableNameIndex].selectedValue = ""
                        if(variableNameIndex!==profileOptionsFromFile.length-1)
                        {
                            if((profileOptionsFromFile[variableNameIndex+1].variableName).includes(profileOptionsFromFile[variableNameIndex].variableName))
                            {
                                profileOptionsFromFile[variableNameIndex+1].selectedValue = ""
                                variableNameIndex++
                            }
                        }
                    }
                }
                temp_list = JSON.parse(JSON.stringify(profileOptionsFromFile))
                document.getElementById("xmlFileToUpload").value=""
                this.setState({
                    selectedVersion:importedData["selectedTechFlowVersion"].trim(),
                    profileName:importedData["profileName"].trim(),
                    profileInfo:profileOptionsFromFile,
                    fileImported:importedData["fileImported"],
                    backupData:temp_list,
                    backupImportedVersion:importedData["selectedTechFlowVersion"].trim()
                })}
            )
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
        /*profileData.forEach(profile=>{
            profile.checked = checked
        })*/
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
                let newProfile = 
                !profile.defaultValue? 
                Object.assign({},profile,{selectedValue:""},{checked:true}):
                Object.assign({},profile,{selectedValue:profile.defaultValue},{checked:true})
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