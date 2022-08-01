const {
  validateCommandParameterTypeAssociation,
} = require("../src/validators/commandValidator");

test("validateCommandParameterTypeAssociation function returns true for empty parameter type for visit command", () => {
  const input = [
    {
      command: "Visit",
      parameterType: "",
    },
  ];
  const expected = true;
  const actual = validateCommandParameterTypeAssociation(input);

  expect(actual.isValid).toBe(expected);
  expect(actual.errorMessage).toBe('');
});

test("validateCommandParameterTypeAssociation function returns false for non empty parameter type for visit command", () => {
  const input = [
    {
      command: "Visit",
      parameterType: "abc",
    },
  ];
  const expected = false;
  const actual = validateCommandParameterTypeAssociation(input);

  expect(actual.isValid).toBe(expected);
  expect(actual.errorMessage).toBe('abc parameter type is not valid for the command Visit');
});

test("validateCommandParameterTypeAssociation function returns false for all invalid commands", () => {
  const input = [
    {
      command: "invalid command",
      parameterType: "abc",
    },
  ];
  const expected = false;
  const actual = validateCommandParameterTypeAssociation(input);

  expect(actual.isValid).toBe(expected);
});
