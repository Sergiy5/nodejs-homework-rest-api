const { Types } = require('mongoose')
require("colors");
const { AppError, tryCatchWrapper, validContacts } = require("../utils");
const Contact = require("../models/contactsModels");


/**
 * Chack ID
 */
exports.checkContactId = tryCatchWrapper(async (req, res, next) => {
  const { id } = req.params;
  const idIsValid = Types.ObjectId.isValid(id);

  const contact = await Contact.exists({ _id: id });

  if (!idIsValid) throw new AppError(404, 'User does not exist');

  if (!contact) throw new AppError(404, "User does not exist");

  next();
});

/**
 * Check valid contact data
 */
exports.checkCreateContactData = tryCatchWrapper(async (req, res, next) => {
  const { error, value } = validContacts.createValidContacts(req.body);
  if (error) {
    console.log("Middlewar Error".yellow, error.message);
    throw new AppError(400, "Invalid user data");
  }
 
  const userExists = await Contact.exists({ email: value.email });

  if (userExists) throw new AppError(409, "User with this email exists");

  req.body = value;
  next();
});

/**
 * Check for update contact data
 */
exports.checkUpdateContactData = tryCatchWrapper(async (req, res, next) => {
  const { error, value } = validContacts.updateValidContacts(req.body);

  if (error) {
    console.log("Middlewar Error".yellow, error.message);
    
    throw new AppError(400, "Invalid user data");
  }

  const userExists = await Contact.exists({ email: value.email });

  if (userExists) throw new AppError(409, "User with this email exists");

  req.body = value;
  next();
});