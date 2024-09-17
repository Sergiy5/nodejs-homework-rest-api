const { removingContact } = require("../../services/contactsServices");
const { tryCatchWrapper } = require("../../utils");

/**
 *Remove contact
 */
exports.removeContact = tryCatchWrapper(async (req, res) => {
  await removingContact(req.params.id);

  res.status(204);
});
