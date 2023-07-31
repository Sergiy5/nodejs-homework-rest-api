require("colors");
const { AppError, tryCatchWrapper, validContacts } = require("../../utils");
const { contactExist, contactExistById } = require('../../services/contactsServices');


/**
 * Chack ID
 */
exports.checkContactId = tryCatchWrapper(async (req, res, next) => {
  const { id } = req.params;

  await contactExistById(id);
  
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

  await contactExist({ email: value.email });

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

  await contactExist({ email: value.email, _id: { $ne: req.params.id } });

  req.body = value;
  next();
});