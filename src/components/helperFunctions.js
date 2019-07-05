import * as multi from "./multiSelectedValue"
import profileInfoCollection from './profileInfoCollection'

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
        let profileOptionsFromFile = []
        let profileSequence = []    //Store the index of profileInfo(from read .tsv file) in the array of profileOptionsFromFile , to solve the profile sequence depedency problem
        reader.onload = () =>
        {
            let textResult = reader.result
            let profileName = ""
            let profileValue = ""
            const lines = textResult.split('\n')
            const profileVariableName = (lines.slice(0,1)[0].split('\t')[1])
            const techFlowVersion = (lines.slice(1,2)[0].split('\t')[1])
            profileOptionsFromFile = loadProfileVariableFromFile("",techFlowVersion,"tsv")  //Load the available profileInfo from profileCollection.js
            const profileNameFromFile = profileOptionsFromFile.map(profile=>profile.variableName)
            lines.slice(2,lines.length).forEach(line=>{
                if(profileNameFromFile.includes(line.split('\t')[0]))
                {
                    profileName = line.split('\t')[0].trim()
                    profileValue = line.split('\t')[1].trim()
                    profileSequence.push(profileNameFromFile.indexOf(profileName))
                    let lineData =      //data extracted from each line in the imported tsv file
                    {
                        "name":profileName,
                        "variableValue": multi.multiSelectedProfile.includes(profileName)?profileValue.split(",") : profileValue.trim(),
                        "isMultiSelected": multi.multiSelectedProfile.includes(profileName),
                        "isPairedMulti":multi.multiSelectedPairedProfile.includes(profileName)
                    }
                    tsvProfileInfo.push(lineData)
                }
            })
            const tsvData = {
                "value":tsvProfileInfo,
                "profileName":profileVariableName,
                "selectedTechFlowVersion":techFlowVersion,
                "fileImported":file[0].name,
                "profileSequence":profileSequence
            }
            document.getElementById("xmlFileToUpload").value=""
            resolve(tsvData)
        }
        if(file.length!==0) {reader.readAsText(file[0]); reader.onerror = reject}
    })
}


//Use the profile variable name to load the corresponding profile into object. Return the object and insert into state
function loadProfileVariableFromFile(data,value,fileType){
    let profileOptions = []
    let i = 0
    
    if(fileType === "tprof")
    {
        changeAllCheckedBoolean(profileInfoCollection).forEach(profile=>{
             //the profile is available for this version
            if(compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)>=0){
                if(profile.variableName === data[i])
                {
                    profile.checked = true
                    i++
                }

                // the profile is only available from the mentioned child version of this version
                if(compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)===2) 
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
                // the profile is only available from the mentioned child version of this version
                if(compareVersion(value,profile.startAvailableVersion,profile.endAvailableVersion)===2) 
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

export {
    changeAllCheckedBoolean,
    compareVersion,
    readTPROF,
    readTSV,
    loadProfileVariableFromFile,
    fetchDataToBackend

}
