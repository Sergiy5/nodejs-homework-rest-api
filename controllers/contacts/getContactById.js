const { getOneContactById } = require("../../services/contactsServices");
const { tryCatchWrapper } = require("../../utils");

/**
 * Get contact by ID
 */
exports.getContactById = tryCatchWrapper(async (req, res) => {
  const contact = await getOneContactById(req.params.id);

  if (contact) {
    res.status(200).json({
      msg: "Succes",
      contact: contact,
    });
  }
});
