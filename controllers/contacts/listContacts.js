const Contact = require("../../models/contactsModels");
const { tryCatchWrapper } = require("../../utils");

/**
 * Get list contacts
 */
exports.listContacts = tryCatchWrapper(async (req, res) => {
  const contacts = await Contact.find();

  res.status(200).json({
    msg: "Succes",
    contacts,
  });
});
