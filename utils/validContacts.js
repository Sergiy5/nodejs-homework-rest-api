const Joi = require("joi");


exports.createValidContacts = (data) =>
  Joi.object()
    .keys({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      favorite: Joi.boolean(),
      owner: Joi.string(),
    })
    .validate(data);

exports.updateValidContacts = (data) =>
  Joi.object()
    .keys({
      name: Joi.string().min(3).max(30),
      email: Joi.string().email(),
      phone: Joi.string(),
      favorite: Joi.boolean(),
      owner: Joi.string(),
    })
    .validate(data);

    