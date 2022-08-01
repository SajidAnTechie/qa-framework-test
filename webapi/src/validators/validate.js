function validate(data, schema) {
  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    return Promise.reject(error);
  }

  return Promise.resolve(value);
}

module.exports = validate;
