const express = require("express");
const { addContact } = require("../../controllers/contacts/addContact");
const { listContacts } = require("../../controllers/contacts/listContacts");
const { updateStatusContact} = require("../../controllers/contacts/updateStatusContact");
const {getContactById} = require("../../controllers/contacts/getContactById");
const { updateContact } = require("../../controllers/contacts/updateContact");
const { removeContact } = require("../../controllers/contacts/removeContact");

const {
  checkContactId,
  checkCreateContactData,
  checkUpdateContactData,
} = require("../../middlewars/contactsMiddlewars");
// const {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
//   updateStatusContact,
// } = require("../../controllers/contacts");

const router = express.Router();
/**
 * Важлива послідовність мідлварсів
 */
router.get("/", listContacts);
router.post("/", checkCreateContactData, addContact);
router.patch("/:id/favorite", checkContactId, updateStatusContact);
router.get("/:id", checkContactId, getContactById);
router.put("/:id", checkContactId, checkUpdateContactData, updateContact);
router.delete("/:id", checkContactId, removeContact);

module.exports = router;

/**
 * Alternative sintaxis
 */
// router
//   .route("/")
//   .post(checkCreateContactData, addContact)
//   .get(listContacts);

// router.use("/:id", checkContactId);
// router
//   .route("/:id")
//   .get(getContactById)
//   .patch(checkUpdateContactData, updateContact)
//   .put("/favorite", updateStatusContact)
//   .delete(removeContact);
