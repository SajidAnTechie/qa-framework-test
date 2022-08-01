const HttpStatus = require('http-status-codes');

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  console.log('my error handleer');
  const error = buildError(err);

  res.status(error.code).json({ error });
}


/**
 * Build error response for validation errors.
 *
 * @param  {error} err
 * @return {array|object}
*/
function buildError(err) {
  // Validation errors
  if (err.isJoi) {
    return {
      code: HttpStatus.StatusCodes.BAD_REQUEST,
      message: HttpStatus.getStatusText(HttpStatus.StatusCodes.BAD_REQUEST),
      details:
        err.details &&
        err.details.map(err => {
          return {
            message: err.message,
            param: err.path.join('.')
          };
        })
    };
  }

  // HTTP errors
  if (err.isBoom) {
    return {
      code: err.output.statusCode,
      message: err.output.payload.message || err.output.payload.error
    };
  }

  // Return INTERNAL_SERVER_ERROR for all other cases
  return {
    code: HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
    message: HttpStatus.getStatusText(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
  };
}

module.exports = { errorHandler };
