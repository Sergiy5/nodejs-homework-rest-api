const { createNewContact } = require("../../services/contactsServices");
const { tryCatchWrapper } = require("../../utils");

/**
 * Add contact
 */
exports.addContact = tryCatchWrapper(async (req, res) => {
  const newContact = await createNewContact(req.body, req.user);

  res.status(201).json({
    msg: "Succes",
    contact: newContact,
  });
});
