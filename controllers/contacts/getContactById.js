const Contact = require("../../models/contactsModels");
const { tryCatchWrapper } = require("../../utils");

/**
 * Get contact by ID
 */
exports.getContactById = tryCatchWrapper(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    res.status(200).json({
      msg: "Succes",
      contact: contact,
    });
  }
});
