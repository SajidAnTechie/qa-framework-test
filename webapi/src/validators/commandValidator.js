const COMMANDS = {
  VISIT: 'Visit',
  ASSERT_EQUALS: 'Assert.Equals',
  SELECT: 'Select',
  TYPE: 'Type',
  CLICK: 'Click',
  WAIT_UNTIL: 'Wait.Until',
  JAVASCRIPT: 'Javascript',
  FUNCTION: 'Function',
  MULTI_RUN: 'MultiRun',
  IFRAME_START: 'IframeStart',
  IFRAME_END: 'IframeEnd'
};

const PARAMETER_TYPES = {
  TITLE: 'Title',
  TEXT: 'Text',
  XPATH: 'XPath',
  CSS: 'CSS',
  ATTRIBUTE: 'Attribute',
  ENTER: 'Enter',
  TAB: 'Tab',
  MILLISECONDS: 'MilliSeconds',
  SECONDS: 'Seconds',
  URL: 'URL',
  DROPDOWN: 'Dropdown',
  CLEAR: 'Clear',
  ASSERT_CONTAINS: 'AssertContains',
  ASSERT_STARTS_WITH: 'AssertStartsWith',
  ASSERT_ENDS_WITH: 'AssertEndsWith',
  ASSERT_GREATER_THAN: 'AssertGreaterThan',
  ASSERT_LESS_THAN: 'AssertLessThan'
};

const COMMANDS_PARAMETER_TYPE_MAPPING = {
  [COMMANDS.VISIT]: [""], // visit command doesn't have any parameter type. Api request will have empty string and having it here will make the code consistent
  [COMMANDS.JAVASCRIPT]: [""],
  [COMMANDS.FUNCTION]: [""],
  [COMMANDS.ASSERT_EQUALS]: [
    PARAMETER_TYPES.TITLE,
    PARAMETER_TYPES.ATTRIBUTE,
    PARAMETER_TYPES.TEXT,
    PARAMETER_TYPES.URL,
    PARAMETER_TYPES.DROPDOWN,
    PARAMETER_TYPES.ASSERT_CONTAINS,
    PARAMETER_TYPES.ASSERT_STARTS_WITH,
    PARAMETER_TYPES.ASSERT_ENDS_WITH,
    PARAMETER_TYPES.ASSERT_GREATER_THAN,
    PARAMETER_TYPES.ASSERT_LESS_THAN
  ],
  [COMMANDS.SELECT]: [
    PARAMETER_TYPES.XPATH,
    PARAMETER_TYPES.TEXT,
    PARAMETER_TYPES.CSS
  ],
  [COMMANDS.TYPE]: [
    PARAMETER_TYPES.TEXT,
    PARAMETER_TYPES.TAB,
    PARAMETER_TYPES.ENTER,
    PARAMETER_TYPES.CLEAR
  ],
  [COMMANDS.CLICK]: [
    PARAMETER_TYPES.XPATH,
    PARAMETER_TYPES.TEXT,
    PARAMETER_TYPES.CSS
  ],
  [COMMANDS.MULTI_RUN]: [
    PARAMETER_TYPES.XPATH,
    PARAMETER_TYPES.CSS
  ],
  [COMMANDS.WAIT_UNTIL]: [
    PARAMETER_TYPES.TEXT,
    PARAMETER_TYPES.XPATH,
    PARAMETER_TYPES.CSS,
    PARAMETER_TYPES.SECONDS,
    PARAMETER_TYPES.MILLISECONDS,
    PARAMETER_TYPES.URL,
    PARAMETER_TYPES.TITLE
  ],
  [COMMANDS.IFRAME_START]: [
    PARAMETER_TYPES.XPATH,
    PARAMETER_TYPES.CSS
  ],
  [COMMANDS.IFRAME_END]: [""],
};

function validTestCase(testCase) {
  const { command, parameterType } = testCase;
  const allowedParameterTypes = COMMANDS_PARAMETER_TYPE_MAPPING[command];

  if (!allowedParameterTypes) {
    return { isValid: false, errorMessage: `${command} is not valid.` };
  }

  if (allowedParameterTypes.includes(parameterType)) {
    return { isValid: true, errorMessage: "" };
  }

  return {
    isValid: false,
    errorMessage: `${parameterType} parameter type is not valid for the command ${command}`,
  };
}

function validateCommandParameterTypeAssociation(testCases) {
  for (let testCase of testCases) {
    const validation = validTestCase(testCase);
    if (!validation.isValid) {
      return validation;
    }
  }

  return { isValid: true, errorMessage: '' };
}

module.exports = { validateCommandParameterTypeAssociation };
