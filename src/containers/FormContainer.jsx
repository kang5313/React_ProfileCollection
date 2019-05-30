import React from 'react'
import profileInfoCollection from '../components/profileInfoCollection'
import Select from '../components/Select'
import Input from '../components/Input'
import CheckBox from "../components/CheckBox"
import Button from "../components/Button"

/*This function handles the comparison of versions to determine whether the profile should be supported in this version or not
 v1 as selected version , v2 as start supporting version , v3 as end supporting version*/
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
function loadProfileVariable(data,value){
    let profileOptions = []
    let i = 0
    profileInfoCollection.forEach(profile=>{
        if(profile.variableName===data[i]){
            profile.checked =true
            i++
            if(compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)===2)  // the profile is only available from the mentioned child version of this version 
            {
                profile.stringToDisplay = "support from "+profile.startAvailableVersion+" onwards."
            }
            else
            {
               profile.stringToDisplay = ""
            }
            profileOptions.push(profile)
        }
    })
    return profileOptions
}

/*This function is used to parse the XML file in the frontend.
  A FileReader is used to read the XML file. The "name" and "selectedTechFlowVersion" attribute in "profile" tag , value in "variable" tag are 
  selected and store in a Javascript object(importedData). Promise is used in this function to ensure the data are completely loaded from the XML before "importedData" is returned.
*/
async function readXML(event){
    return new Promise((resolve,reject)=>{
        let parser = new DOMParser()
        var file = event.target.files
        let techflowVersion
        let profileName
        var reader = new FileReader();
        reader.onload =() =>
            {
                let importedXMLData = []
                let textResult = reader.result
                let XMLResult = parser.parseFromString(textResult,"text/xml")
                techflowVersion = XMLResult.getElementsByTagName("profile")[0].getAttribute("selectedTechFlowVersion")
                profileName = XMLResult.getElementsByTagName("profile")[0].getAttribute("name")
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
                    "profileName":profileName
                }
                resolve(importedData)
            }
        reader.readAsText(file[0])
        reader.onerror = reject
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
            disabled:false
        }
    }

    /*This function handles the selection of versions. 
    The profileInfoCollection will be mapped but compareVersion function will be called to filter the profile to be selected.*/
    handleVersion = (event) =>{
        event.preventDefault()
        let value = event.target.value
        let name = event.target.name
        let profileOptions = []
        
        profileInfoCollection.forEach(profile=>{
                if(compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)>=0){    //the profile is available for this version
                    profile.checked =true
                    if(compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)===2)  // the profile is only available from the mentioned child version of this version 
                    {
                        profile.stringToDisplay = "support from "+profile.startAvailableVersion+" onwards."
                    }
                    else
                    {
                        profile.stringToDisplay = ""
                    }
                    profileOptions.push(profile)
                }
            }
        )

        this.setState(
            prevState=>({
                profileInfo:profileOptions,
                [name]:value
            })
        )
    }
    
    //This function handles user input and change the corresponding data in profileInfoCollection according to the input type.
    handleInput = (event) =>{
        const {id,value,type,checked} = event.target
        let profileData = this.state.profileInfo
        console.log(profileData[id])
        if (type === "select-one")  {profileData[id].selectedValue = value}
        else if(type === "checkbox")    {profileData[id].checked=checked}
        else if(type === "text")    {profileData[id].value=value}

        this.setState(
            prevState=>({
                profileInfo:profileData
            })
        )
    }

    handleSubmit = (event) =>{
        let profileData = []
        let profileInfoArray = this.state.profileInfo
        for(var i = profileInfoArray.length-1;i>=0;i--){
            if(profileInfoArray[i].checked===false){
                profileInfoArray.splice(i,1)
            }
        }
        profileData.push(profileInfoArray)
        profileData.push(this.state.selectedVersion)
        profileData.push(this.state.profileName)
        let url = "http://localhost:8000"
        let fetchData = {
            method: 'POST',
            body: JSON.stringify(profileData),
            mode:'cors',
            headers: new Headers()
        }
        fetchDataToBackend(url,fetchData)
        .then(filename=>{
            window.open(url+"/xml/"+filename)
        })
        .catch(error=>console.error('Error : ',error))
        event.preventDefault();
        this.setState((prevState) => ({ 
            profileInfo: [],
            selectedVersion:""
        }))
    }

//User imports xml file. Based the techflow version in xml file import the relevant profile into the form
//Should be updated to import profile according to the profile name in the xml
    importXMLFile = (event) => {
        let i = 0
        let profileOptions = []
        let profileVariableName = []
        readXML(event)
        .then(importedData=>{
            importedData["value"].forEach(profile=>{
                profileVariableName.push(profile["name"])
            })
            profileOptions=loadProfileVariable(profileVariableName,importedData["selectedTechFlowVersion"])//updateVersion(importedData["selectedTechFlowVersion"])
            profileOptions.forEach(profile=>{
                if(profile.hasOwnProperty("selectedValue"))
                {
                    profile.selectedValue = importedData["value"][i]["variableValue"]
                }
                else
                {
                    profile.value = importedData["value"][i]["variableValue"]
                }
                i++
            })
            this.setState((prevState)=>({
                selectedVersion:importedData["selectedTechFlowVersion"],
                profileName:importedData["profileName"],
                profileInfo:profileOptions
            }))})
    }

    handleProfileName = (event) =>{
        const {value,name} = event.target
        this.setState((prevState)=>({
            [name]:value
        }))
    }

    render(){
        //Rendering the component based on the component's input type.
        return(    
            <form className="container-fluid" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label>Import XML : </label>
                    <input type="file" className ="form-control mb-5" name="file-to-upload" id="fileToUpload" onInput={this.importXMLFile}></input>
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
                <div>
                {this.state.profileInfo.map((profile,i)=>{
                    if(profile.type==="select"){
                        return(
                            <div key={this.state.profileInfo[i].id}>                               
                                 <label>{i+1}</label>
                                 <br/>
                                 <div className="form-group">
                                    <CheckBox
                                        handleCheckbox={this.handleInput}
                                        checked={profile.checked}
                                        title={profile.variableName}
                                        reminder={profile.stringToDisplay}
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
                                <CheckBox
                                        handleCheckbox={this.handleInput}
                                        checked={profile.checked}
                                        title={profile.variableName}
                                        reminder={profile.stringToDisplay}
                                />
                                <Input
                                    id={i}
                                    type={"text"}
                                    name={"value"}
                                    value={profile.value}
                                    checked={profile.checked}
                                    placeholder={profile.placeholder}
                                    handleChange={this.handleInput}
                                    disabled={!profile.checked}
                                />
                            </div>
                        )
                    
                }
                )}
                </div>
                <Button 
                    type = {"submit"}
                    name={"btn btn-primary"}
                    title={"Submit"}
                />
            </form>
        )
    }
}   

export default FormContainer