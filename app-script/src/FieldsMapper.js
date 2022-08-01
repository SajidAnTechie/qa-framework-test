function testCasesFieldsMapping() {
  return {
    rowNumber: "rowNumber",
    // testScenarioId: TEST_SCENARIO_ID_COLUMN,
    // scenarioName: SCENARIO_NAME_COLUMN,
    testCaseId: TEST_CASE_ID_COLUMN,
    step: STEP_COLUMN,
    label: LABEL_COLUMN,
    parameter: PARAMETER_COLUMN,
    parameterType: PARAMETER_TYPE_COLUMN,
    command: COMMAND_COLUMN,
    // prerequisites: PREREQUISITES_COLUMN,
    expectedResult: EXPECTED_RESULT_COLUMN
  }
}

function testCasesBackfillFields() {
  return [
    TEST_CASE_ID_COLUMN,
    STEP_COLUMN,
    LABEL_COLUMN,
  ]
}

function reusablesFieldsMapping() {
  return {
    functionName: REUSABLE_FUNCTION_NAME_COLUMN,
    parameter: REUSABLE_PARAMETER_COLUMN,
    parameterType: REUSABLE_PARAMETER_TYPE_COLUMN,
    command: REUSABLE_COMMAND_COLUMN,
    expectedResult: REUSABLE_SHOULD_BE_COLUMN,
  }
}

function reuseablesBackfillFields() {
  return [
    REUSABLE_FUNCTION_NAME_COLUMN,
  ]
}

function configurationFieldsMapping() {
  return {
    command: CONFIGURATION_COMMAND_COLUMN,
    key: CONFIGURATION_KEY_COLUMN,
    value: CONFIGURATION_VALUE_COLUMN,
  }
}

function mapFields(obj, mapping) {
  let finalObj = {}
  for (const [key, value] of Object.entries(mapping)) {
    finalObj[key] = obj[value]
  }

  return finalObj
}
