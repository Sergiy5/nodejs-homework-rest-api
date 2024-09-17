const { updatingStatusContact } = require("../../services/contactsServices");
const { tryCatchWrapper } = require("../../utils");

/**
 * Updatin status contact
 */
exports.updateStatusContact = tryCatchWrapper(async (req, res) => {
  const newStatusContact = await updatingStatusContact(
    req.params.id,
    req.body.favorite
  );

  res.status(200).json({
    msg: "Succes",
    contact: newStatusContact,
  });
});
