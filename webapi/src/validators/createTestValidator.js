const Joi = require("@hapi/joi");
const { boomify } = require("@hapi/boom");

const validate = require("./validate");
const {
  validateCommandParameterTypeAssociation,
} = require("./commandValidator");

const testCase = {
  rowNumber: Joi.number().required(),
  testCaseId: Joi.string().optional(),
  step: Joi.string().optional(),
  label: Joi.string().optional(),
  parameter: Joi.any().allow("").required(),
  parameterType: Joi.string().allow("").optional(),
  command: Joi.string().required(),
  expectedResult: Joi.any().allow("").optional(),
};

const testCaseSchema = Joi.object(testCase);

const reuseablesSchema = Joi.object({
  functionName: Joi.string().required(),
  ...testCase,
});

const createTestSchema = Joi.object({
  sheet: Joi.object({
    sheetId: Joi.string().required(),
    pageId: Joi.string().required(),
    pageName: Joi.string().required(),
    sheetName: Joi.string().required(),
  }).required(),
  configurations: Joi.array()
    .items(
      Joi.object({
        command: Joi.string().required(),
        key: Joi.string().required(),
        value: Joi.string().required(),
      })
    )
    .required(),
  reusables: Joi.array().items(reuseablesSchema).required(),
  testcases: Joi.array().items(testCaseSchema).required(),
});

const createAllTestSchema = Joi.array().items(createTestSchema);

function createTestJoiValidator(req, res, next) {
  return validate(req.body, Array.isArray(req.body) ? createAllTestSchema :createTestSchema)
    .then(() => next())
    .catch((err) => {
      next(err, req, res, next);
    });
}

function createTestCommandParameterTypeValidator(req, res, next) {
  const { testcases } = req.body;

  if (testcases.length === 0) {
    throw new Error("Test cases cannot be empty.");
  }

  const validation = validateCommandParameterTypeAssociation(testcases);

  if (!validation.isValid) {
    const err = new Error(validation.errorMessage);

    throw boomify(err, { statusCode: 400 });
  }

  next();
}

function createAllTestCommandParameterTypeValidator(req, res, next) {
  const testCases = req.body;

  testCases.forEach(testCase => {
    const { testcases } = testCase;

    if (testcases.length === 0) {
      throw new Error("Test cases cannot be empty.");
    }

    const validation = validateCommandParameterTypeAssociation(testcases);
  
    if (!validation.isValid) {
      const err = new Error(validation.errorMessage);
  
      throw boomify(err, { statusCode: 400 });
    }
  });

  next();
}

module.exports = {
  testCaseSchema,
  createTestJoiValidator,
  createTestCommandParameterTypeValidator,
  createAllTestCommandParameterTypeValidator
};
