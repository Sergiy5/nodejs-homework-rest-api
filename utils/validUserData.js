const Joi = require("joi");
const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/;
  
exports.registerValidUser = (data) =>
  Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().regex(PASSWORD_REGEX),
      subscription: Joi.string(),
    })
    .validate(data);

exports.validUserEmail = (email) =>
  Joi.object()
    .keys({
      email: Joi.string().email().required(),
    })
    .validate(email);
