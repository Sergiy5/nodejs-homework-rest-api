const Joi = require("joi");
const userRolesEnum = require("../cntacts/userRolesEnum");
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/;

exports.createValidContacts = (data) =>
  Joi.object()
    .keys({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      favorite: Joi.boolean(),
      password: Joi.string().regex(PASSWORD_REGEX),
      role: Joi.string().valid(...Object.values(userRolesEnum)),
    })
    .validate(data);

exports.updateValidContacts = (data) =>
  Joi.object()
    .keys({
      name: Joi.string().min(3).max(30),
      email: Joi.string().email(),
      phone: Joi.string(),
      favorite: Joi.boolean(),
      password: Joi.string().regex(PASSWORD_REGEX),
      role: Joi.string().valid(...Object.values(userRolesEnum)),
    })
    .validate(data);
