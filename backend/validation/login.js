const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateLoginInput = (data) => {
  let errors = {};

  let { userName, password } = data;

  //converting empty feilds to empty string for validations functions to work
  userName = !isEmpty(userName) ? userName : '';
  password = !isEmpty(password) ? password : '';

  if (Validator.isEmpty(userName)) {
    errros.userName = 'User Name is required';
  }

  if (Validator.isEmpty(password)) {
    errros.password = 'Password is required';
  } else if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errros.password = 'Password must be at least 6 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
