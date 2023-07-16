const Joi = require("joi");

 exports.createValidCotacts = (data) =>
   Joi.object().keys({
     name: Joi.string().min(3).max(15).required(),
     email: Joi.string().email().required(),
     phone: Joi.string().required(),
   }).validate(data);