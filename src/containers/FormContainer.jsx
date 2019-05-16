import React from 'react'
import profileInfoCollection from '../components/profileInfoCollection'
import Select from '../components/Select'
import Input from '../components/Input'
import CheckBox from "../components/CheckBox"
import Button from "../components/Button"

const initialProfileData = profileInfoCollection

async function fetchDataToBackend(url,data)
{
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

var versionCompareValue

class FormContainer extends React.Component{
    constructor(props){
        super(props)
        this.state={
            profileInfo:[],
            selectedVersion:"",
            versionOptions:["3.6.0","3.6.1","3.7.0","3.10.0","3.10.1","3.11.0","3.11.1","3.11.2"],
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
        
        profileInfoCollection.map(profile=>{
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
                    profile.selectedValue = ""
                    profile.defaultValue ? profile.value=profile.defaultValue : profile.value = ""  //set the value to default value if the default value is available
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
        console.log(type)
        if (type === "select-one")  {profileData[id].selectedValue = value}
        else if(type === "checkbox")    {profileData[id].checked=checked}
        else if(type === "text")    {profileData[id].value=value}

        this.setState(
            prevState=>({
                profileInfo:profileData
            })
        )
        console.log(profileData[id])
    }

    handleSubmit = (event) =>{
        let profileData = this.state.profileInfo
        for(var i = profileData.length-1;i>=0;i--){
            if(profileData[i].checked===false){
                profileData.splice(i,1)
            }
        }
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

    render(){
        var counter = 0
        //Rendering the component based on the component's input type.
        return(    
            <form className="container-fluid" onSubmit={this.handleSubmit}>
                <Select
                    title={"Select TechFlow's Version "}
                    name={"selectedVersion"}
                    options={this.state.versionOptions}
                    value={this.state.selectedVersion}
                    placeholder={"Select Version"}
                    handleChange={this.handleVersion}
                />
                <hr/>
                {this.state.profileInfo.map(profile=>{
                    ++counter
                    if(profile.type==="select"){
                        return(
                            <div>                               
                                 <label>{counter}</label>
                                 <br/>
                                 <div className="form-group">
                                    <CheckBox
                                        handleCheckbox={this.handleInput}
                                        checked={profile.checked}
                                        id={counter-1}
                                        title={profile.variableName}
                                        reminder={profile.stringToDisplay}
                                    />
                                    <Select
                                        id={counter-1}
                                        name={"selectedValue"}
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
                    if(profile.type==="text"){
                        return(
                            <div>
                                <label>{counter} </label>
                                <br/>
                                <CheckBox
                                        handleCheckbox={this.handleInput}
                                        checked={profile.checked}
                                        id={counter-1}
                                        title={profile.variableName}
                                        reminder={profile.stringToDisplay}
                                />
                                <Input
                                    id={counter-1}    
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
                }
                )}
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