const Joi = require("@hapi/joi");
const testExecutionStatus = require("../constants/testExecutionStatus");
const validate = require("./validate");

const bodySchema = Joi.object({
  status: Joi.string()
    .valid(
      testExecutionStatus.alreadyRunning,
      testExecutionStatus.completed,
      testExecutionStatus.queued
    )
    .required(),
});

function updateTestStatusValidator(req, res, next) {
  return validate(req.body, bodySchema)
    .then(() => next())
    .catch((err) => {
      next(err, req, res, next);
    });
}

module.exports = { updateTestStatusValidator };
