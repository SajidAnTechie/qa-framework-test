const {
  validateCommandParameterTypeAssociation,
} = require("../src/validators/commandValidator");


const input = [
  {
    command: "Visit",
    parameterType: "",
  },
  {
    command: "Assert.Equals",
    parameterType: "Title",
  },
  {
    command: "Assert.Equals",
    parameterType: "Attribute",
  },
  {
    command: "Assert.Equals",
    parameterType: "Text",
  },
  {
    command: "Assert.Equals",
    parameterType: "URL",
  },
  {
    command: "Assert.Equals",
    parameterType: "Dropdown",
  },
  {
    command: "Select",
    parameterType: "XPath",
  },
  {
    command: "Select",
    parameterType: "CSS",
  },
  {
    command: "Select",
    parameterType: "Text",
  },
  {
    command: "Click",
    parameterType: "XPath",
  },
  {
    command: "Click",
    parameterType: "CSS",
  },
  {
    command: "Click",
    parameterType: "Text",
  },
  {
    command: "Type",
    parameterType: "Text",
  },
  {
    command: "Type",
    parameterType: "Tab",
  },
  {
    command: "Type",
    parameterType: "Enter",
  },
  {
    command: "Wait.Until",
    parameterType: "Title",
  },
  {
    command: "Wait.Until",
    parameterType: "Text",
  },
  {
    command: "Wait.Until",
    parameterType: "XPath",
  },
  {
    command: "Wait.Until",
    parameterType: "CSS",
  },
  {
    command: "Wait.Until",
    parameterType: "MilliSeconds",
  },
  {
    command: "Wait.Until",
    parameterType: "Seconds",
  },
  {
    command: "Wait.Until",
    parameterType: "URL",
  },
];

test("validateCommandParameterTypeAssociation function returns true for all valid combinations", () => {
  const expected = true;
  const actual = validateCommandParameterTypeAssociation(input);

  expect(actual.isValid).toBe(expected);
  expect(actual.errorMessage).toBe('');  
});
