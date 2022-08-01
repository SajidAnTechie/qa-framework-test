const Joi = require("@hapi/joi");
const validate = require("./validate");
const { PASS, FAIL } = require("../constants/testStatus");
const { testCaseSchema } = require("./createTestValidator");

const schema = Joi.object({
  sheetId: Joi.string().required(),
  pageId: Joi.string().required(),
  testResult: Joi.object({
    status: Joi.string().valid(PASS, FAIL).required(),
    testCase: testCaseSchema,
    timeTaken: Joi.number().required(),
    errorMessage: Joi.string().allow("").optional(),
    outerHTML: Joi.string().allow("").optional(),
    stackTrace: Joi.string().allow("").optional(),
    screenshot: Joi.string().allow("").optional(),
  })
});

const resultsSchema = Joi.array().items(
  Joi.object({
    sheetId: Joi.string().required(),
    pageId: Joi.string().required(),
  })
)

function resultValidator(req, res, next) {
  return validate(req.body, schema)
    .then(() => next())
    .catch((err) => {
      next(err, req, res, next)
    });
}

function resultsValidator(req, res, next) {
  return validate(req.body, resultsSchema)
    .then(() => next())
    .catch((err) => {
      next(err, req, res, next)
    });
}

module.exports = {
  resultValidator,
  resultsValidator
};
