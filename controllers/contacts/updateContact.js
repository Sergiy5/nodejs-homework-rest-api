const { updatingContact } = require("../../services/contactsServices");
const { tryCatchWrapper } = require("../../utils");

/**
 * Update contact
 */
exports.updateContact = tryCatchWrapper(async (req, res) => {
  const updatedContact = await updatingContact(req.params.id, req.body);

  res.status(201).json({
    msg: "Succes",
    contact: updatedContact,
  });
});
