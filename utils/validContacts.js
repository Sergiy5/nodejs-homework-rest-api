const Joi = require("joi");

 exports.createValidCotacts = (data) =>
   Joi.object().keys({
     name: Joi.string().min(3).max(11).required(),
     email: Joi.string().email().required(),
     phone: Joi.number().min(7).max(11).required(),
   }).validate(data);