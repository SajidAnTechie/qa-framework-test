const LOG_LIMIT = 5001;

function isValidCount(count) {
  if(count === 'all') {
    return { isValid: true, errorMessage: ''};
  }
  let intCount = parseInt(count);

  if(intCount <= 0) {
    return { isValid: false, errorMessage: `Count should be greater than 0 or 'all'`};
  }

  if(intCount < LOG_LIMIT) {
    return { isValid: true, errorMessage: ''};
  }

  return { isValid: false, errorMessage: `Count can be either 'all' or a positive integer less than ${LOG_LIMIT}`};
}

function logCountValidator(req, res, next) {
  const { count } = req.params;
  const validation = isValidCount(count);

  if(validation.isValid) {
    next();
  } else {
    const err = new Error(validation.errorMessage);
    
    throw boomify(err, {statusCode: 400});
  }
}

module.exports = { logCountValidator, LOG_LIMIT };
