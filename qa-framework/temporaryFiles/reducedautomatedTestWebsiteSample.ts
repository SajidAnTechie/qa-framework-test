const reducedAutomatedTestWebsiteSample = {
	"sheet": {
		"sheetId": "1UxSJw-1sIayDkBsU-9j2fJLgFdW6fbM85KnZ10Xu9lY",
		"sheetName": "Subash: MVS Events Tenant(Full)",
		"pageId": "1481384868",
		"pageName": "TC-MVS-Second-Page"
	},
	"configurations": [{
		"command": "Environment",
		"key": "Environment",
		"value": "qa"
	}, {
		"command": "qa",
		"key": "fname",
		"value": "subash poudel"
	}, {
		"command": "dev",
		"key": "fname",
		"value": "sanjay"
	}],
	"reusables": [{
		"functionName": "Fill Service Selection Page",
		"parameter": "//*[@id=\"service-selection\"]/option[2]",
		"parameterType": "XPath",
		"command": "Click",
		"expectedResult": "",
		"rowNumber": -1,
		"testCaseId": "N/A",
		"step": "N/A",
		"label": "N/A"
	}, {
		"functionName": "Fill Service Selection Page",
		"parameter": "//*[@id=\"vaccine-selection\"]/option[2]",
		"parameterType": "XPath",
		"command": "Click",
		"expectedResult": "",
		"rowNumber": -1,
		"testCaseId": "N/A",
		"step": "N/A",
		"label": "N/A"
	}, {
		"functionName": "Fill Service Selection Page",
		"parameter": "Select Clinic",
		"parameterType": "Text",
		"command": "Click",
		"expectedResult": "",
		"rowNumber": -1,
		"testCaseId": "N/A",
		"step": "N/A",
		"label": "N/A"
	}],
	"testcases": [{
		"rowNumber": 2,
		"parameter": "https://events.signetic.com/service?lang=en",
		"parameterType": "",
		"command": "Visit",
		"expectedResult": ""
	}, {
		"rowNumber": 3,
		"parameter": "Managed Vaccination Solution",
		"parameterType": "Text",
		"command": "Wait.Until",
		"expectedResult": ""
	}, {
		"rowNumber": 4,
		"parameter": "Fill Service Selection Page",
		"parameterType": "",
		"command": "Function",
		"expectedResult": ""
	}, {
		"rowNumber": 5,
		"parameter": "https://events.signetic.com/location?lang=en",
		"parameterType": "URL",
		"command": "Wait.Until",
		"expectedResult": ""
	}, {
		"rowNumber": 6,
		"parameter": "Clinics for ",
		"parameterType": "Text",
		"command": "Wait.Until",
		"expectedResult": ""
	}, {
		"rowNumber": 7,
		"parameter": "//*[@id=\"service\"]",
		"parameterType": "XPath",
		"command": "Select",
		"expectedResult": ""
	}, {
		"rowNumber": 8,
		"parameter": "",
		"parameterType": "Dropdown",
		"command": "Assert.Equals",
		"expectedResult": "COVID"
	}, {
		"rowNumber": 9,
		"parameter": "//*[@id=\"vaccine\"]",
		"parameterType": "XPath",
		"command": "Select",
		"expectedResult": ""
	}, {
		"rowNumber": 10,
		"parameter": "",
		"parameterType": "Dropdown",
		"command": "Assert.Equals",
		"expectedResult": "Moderna"
	}, {
		"rowNumber": 11,
		"parameter": "Continue",
		"parameterType": "Text",
		"command": "Select",
		"expectedResult": ""
	}, {
		"rowNumber": 12,
		"parameter": "disabled",
		"parameterType": "Attribute",
		"command": "Assert.Equals",
		"expectedResult": true
	}, {
		"rowNumber": 13,
		"parameter": "//*[@id=\"location\"]",
		"parameterType": "XPath",
		"command": "Select",
		"expectedResult": ""
	}, {
		"rowNumber": 14,
		"parameter": "asdf",
		"parameterType": "Text",
		"command": "Type",
		"expectedResult": ""
	}, {
		"rowNumber": 15,
		"parameter": "",
		"parameterType": "Enter",
		"command": "Type",
		"expectedResult": ""
	}, {
		"rowNumber": 16,
		"parameter": "No Sites available",
		"parameterType": "Text",
		"command": "Wait.Until",
		"expectedResult": ""
	}, {
		"rowNumber": 17,
		"parameter": "",
		"parameterType": "Clear",
		"command": "Type",
		"expectedResult": ""
	}, {
		"rowNumber": 18,
		"parameter": "Search",
		"parameterType": "Text",
		"command": "Click",
		"expectedResult": ""
	}, {
		"rowNumber": 19,
		"parameter": "Clinics for",
		"parameterType": "Text",
		"command": "Wait.Until",
		"expectedResult": ""
	}, {
		"rowNumber": 20,
		"parameter": "//*[@id=\"root\"]/div/div[2]/div/div[3]/section/div/div/div[1]/div[1]/h3",
		"parameterType": "XPath",
		"command": "Select",
		"expectedResult": ""
	}, {
		"rowNumber": 21,
		"parameter": "Clinics for Moderna",
		"parameterType": "Text",
		"command": "Assert.Equals",
		"expectedResult": ""
	}, {
		"rowNumber": 22,
		"parameter": "#root > div > div.main-wrapper.main-wrapper-sm > div > div.multi-service-clinic > section > div > div > div.col-6-lg.pr-0x-lg > div.choose-clinic-location__container > div.choose-clinic-location.custom-scrollbar.mr-7x-lg > div > div",
		"parameterType": "CSS",
		"command": "Click",
		"expectedResult": ""
	}]
};

export default reducedAutomatedTestWebsiteSample;
