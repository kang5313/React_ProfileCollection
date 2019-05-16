const profileInfo=[
    {
        "variableName":"TestFacilityName",
        "type":"text",
        "category":"Settings",
        "startAvailableVersion":"0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "value":"",
        "placeholder":"<Enter Customer Facility Name>"
    },//1
    {   
        "variableName":"techFlow.SupportedTargetPlatform",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","x86","x64","x86,x64"],
        "startAvailableVersion":"3.10.0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//2
    {
        "variableName":"techFlow.SupportedTargetPlatform.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["x86","x64","x86,x64"],
        "startAvailableVersion":"3.10.0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//3
    {
        "variableName":"techFlow.ShowTargetPlatformDropdown",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","Show","Hide"],
        "startAvailableVersion":"3.10.0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//4
    {
        "variableName":"techFlow.ShowTargetPlatformDropdown.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Show","Hide"],
        "startAvailableVersion":"3.10.0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//5
    {
        "variableName":"techFlow.SupportedTargetFramework",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","NF2","NF4","NF2,NF4"],
        "startAvailableVersion":"3.10.0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//6
    {
        "variableName":"techFlow.SupportedTargetFramework.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["NF2","NF4","NF2,NF4"],
        "startAvailableVersion":"3.10.0.1",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//7
    {
        "variableName":"ProdSys.DefaultPlatform",
        "type":"select",
        "category":"Settings",
        "supportedValue":["x86","x64"],
        "startAvailableVersion":"3.6.0",
        "endAvailableVersion":"3.9",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//8    
    {
        "variableName":"ProdSys.DefaultPlatform",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","Anything","x86","x64"],
        "startAvailableVersion":"3.10.0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//9
    {
        "variableName":"ProdSys.DefaultPlatform.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["x86","x64"],
        "startAvailableVersion":"3.10.0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//10
    {
        "variableName":"ProdSys.DefaultFramework",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","NF2","NF4","NF2,NF4"],
        "startAvailableVersion":"3.10.0.1",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//11
    {
        "variableName":"ProdSys.DefaultFramework.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["NF2","NF4","NF2,NF4"],
        "startAvailableVersion":"3.10.0.1",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//12
    {
        "variableName":"Launcher.Wizard.ShowOnlyDefaultProjectTemplate",
        "type":"select",
        "category":"Settings",
        "supportedValue":["TRUE","FALSE"],
        "startAvailableVersion":"3.10.0.1",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//13
    {
        "variableName":"Launcher.Wizard.ForceTargetPlatform",
        "type":"select",
        "category":"Settings",
        "supportedValue":["x86","x64"],
        "startAvailableVersion":"3.10.0.1",
        "StringToDisplay" : "support from 3.10.0.1 onwards",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//14
    {
        "variableName":"Launcher.Wizard.DefaultTargetPlatform",
        "type":"select",
        "category":"Settings",
        "supportedValue":["x86","x64"],
        "startAvailableVersion":"3.10.0.1",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//15
    {
        "variableName":"Launcher.Wizard.SupportedTargetPlatform",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Any","x86","x64"],
        "startAvailableVersion":"3.10.0.1",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//16
    {
        "variableName":"VisualStudio.ProjectTemplatesDir",
        "type":"text",
        "category":"Library",
        "startAvailableVersion":"3.0.1.2",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "defaultValue":"techFlow3/bin/lib/vslib",
        "value":""
    },//17
    {
        "variableName":"VisualStudio.DefaultProgrammingLanguage",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Cpp","CppNF4"],
        "startAvailableVersion":"3.10.0.84",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//18
    {
        "variableName":"VisualStudio.DefaultProjectTemplate.Cpp",
        "type":"text",
        "category":"Settings",
        "startAvailableVersion":"3.0.1.2",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "defaultValue":"Default",
        "value":""
    },//19
    {
        "variableName":"VisualStudio.DefaultProjectTemplate.CppNF4",
        "type":"text",
        "category":"Settings",
        "startAvailableVersion":"3.10.0.84",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "value":"",
        "defaultValue":"Default"
    },//20
    {
        "variableName":"VisualStudio.PreferredIDE.Cpp",
        "type":"select",
        "category":"Settings",
        "supportedValue":["vc80","vs80","vc90","vs90"],
        "startAvailableVersion":"3.0.1.13",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//21
    {
        "variableName":"VisualStudio.PreferredIDE.CppNF4",
        "type":"select",
        "category":"Settings",
        "supportedValue":["vs140"],
        "startAvailableVersion":"3.10.0.84",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//22
    {
        "variableName":"VisualStudio.GeneratePlatform.Cpp",
        "type":"select",
        "category":"Settings",
        "supportedValue":["x86","x64","x86,x64"],
        "startAvailableVersion":"3.10.0.82",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//23
    {
        "variableName":"VisualStudio.GeneratePlateform.CppNF4",
        "type":"select",
        "category":"Settings",
        "supportedValue":["x86","x64","x86,x64"],
        "startAvailableVersion":"3.10.0.84",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//24
    {
        "variableName":"techFlow.Settings",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Profile","WinUserRoaming"],
        "startAvailableVersion":"3.3.1.1496",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//25
    {
        "variableName":"ProdSys.EDReplacement",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Profile","WinUserRoaming"],
        "startAvailableVersion":"3.4.2.273",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//26
    {
        "variableName":"techFlow.Test.DefaultTestItemPathSelector",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","SetResult","Pass","Fail","OutputPathNumber","ForceDefaultPath"],
        "startAvailableVersion":"3.7.0.1697",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//27
    {
        "variableName":"techFlow.Test.DefaultTestItemPathSelector.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["SetResult","Pass","Fail","OutputPathNumber","ForceDefaultPath"],
        "startAvailableVersion":"3.7.0.1697",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//28
    {
        "variableName":"techFlow.Test.LimitInheritResultPrefix",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","True","False"],
        "startAvailableVersion":"3.5.0.1047",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//29
    {
        "variableName":"techFlow.Test.LimitInheritResultPrefix.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["True","False"],
        "startAvailableVersion":"3.5.0.1047",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//30
    {
        "variableName":"techFlow.Test.ShowTestNumber",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","True","False"],
        "startAvailableVersion":"3.5.0.1047",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//31
    {
        "variableName":"techFlow.Test.ShowTestNumber.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["True","False"],
        "startAvailableVersion":"3.5.0.1047",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//32
    {
        "variableName":"techFlow.Test.TestNumberMode",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","Classic","UserDefined"],
        "startAvailableVersion":"3.6.0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//33
    {
        "variableName":"techFlow.Test.TestNumberMode.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Classic","UserDefined"],
        "startAvailableVersion":"3.6.0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//34
    {
        "variableName":"techFlow.Test.GradingTestShareTestNumber",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","True","False"],
        "startAvailableVersion":"3.5.0.1047",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//35
    {
        "variableName":"techFlow.Test.GradingTestShareTestNumber.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["True","False"],
        "startAvailableVersion":"3.5.0.1047",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//36
    {
        "variableName":"techFlow.CreateDebugGlobalVariable",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","DontBother","AlwaysCreate"],
        "startAvailableVersion":"3.7.0.1674",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//37
    {
        "variableName":"techFlow.CreateDebugGlobalVariable.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["DontBother","AlwaysCreate"],
        "startAvailableVersion":"3.7.0.1674",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//38
    {
        "variableName":"techFlow.DefaultDebugGlobalVariableValue",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","0","1"],
        "startAvailableVersion":"3.7.0.1674",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//39
    {
        "variableName":"techFlow.DefaultDebugGlobalVeriableValue.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["0","1"],
        "startAvailableVersion":"3.7.0.1674",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//40
    {
        "variableName":"techFlow.ShowDebugDropdown",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","Show","Hide"],
        "startAvailableVersion":"3.7.0.1674",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//41
    {
        "variableName":"techFlow.ShowDebugDropdown.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Show","Hide"],
        "startAvailableVersion":"3.7.0.1674",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//42
    {
        "variableName":"techFlow.ShowFlowEditorUponRecipeLoaded",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Inherit","True","False"],
        "startAvailableVersion":"3.10.1.1998",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//43
    {
        "variableName":"techFlow.ShowFlowEditorUponRecipeLoaded.IfParentNotFound",
        "type":"select",
        "category":"Settings",
        "supportedValue":["True","False"],
        "startAvailableVersion":"3.10.1.1998",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//44
    {
        "variableName":"Launcher.ShowRTDP",
        "type":"select",
        "category":"Settings",
        "supportedValue":["True","False"],
        "startAvailableVersion":"0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//45
    {
        "variableName":"Launcher.ShowProjectHistory",
        "type":"select",
        "category":"Settings",
        "supportedValue":["Show","Hide","HideIfRTDP"],
        "startAvailableVersion":"3.6.0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//46
    {
        "variableName":"SiteGroup.IncludeExcludeDUTBasedOnCommitResult",
        "type":"select",
        "category":"Settings",
        "supportedValue":["True","False"],
        "startAvailableVersion":"0",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//47
    {
        "variableName":"techFlow.SupportedOperationMode",
        "type":"select",
        "category":"Settings",
        "supportedValue":["SingleSite","TrueParallel","IndexParallel"],
        "startAvailableVersion":"3.10.0.1",
        "endAvailableVersion":"9999.9999.9999.9999",
        "stringToDisplay" : "",
        "checked":false,
        "selectedValue":""
    },//48
]

export default profileInfo