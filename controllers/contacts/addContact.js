const { addingContact } = require("../../services/contactsServices");
const { tryCatchWrapper } = require("../../utils");

/**
 * Add contact
 */
exports.addContact = tryCatchWrapper(async (req, res) => {
  const newContact = await addingContact(req.body);

  res.status(201).json({
    msg: "Succes",
    contact: newContact,
  });
});
