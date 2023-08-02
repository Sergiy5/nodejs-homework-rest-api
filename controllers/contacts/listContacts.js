const { allContacts } = require("../../services/contactsServices");
const { tryCatchWrapper } = require("../../utils");

/**
 * Get list contacts
 */
module.exports.listContacts = tryCatchWrapper(async (req, res) => {
  const contacts = await allContacts(req.query, req.user);

  res.status(200).json({
    msg: "Succes",
    contacts,
    total: contacts.length,
  });
});
