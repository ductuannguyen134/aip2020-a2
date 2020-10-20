const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateRequestInput = (data) => {
  let errors = {};

  let { requestContent, requestFavors } = data;

  // Converting empty fields to empty string for validating functions works
  requestContent = !isEmpty(requestContent) ? requestContent : '';
  requestFavors = !isEmpty(requestFavors) ? requestFavors : '';

  if (Validator.isEmpty(requestContent)) {
    errors.requestContent = 'Request content is required';
  } else if (Validator.isEmpty(requestFavors)) {
    errors.requestFavors = 'Request favor is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
