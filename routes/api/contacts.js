const express = require("express");
const {
  checkContactId,
  checkCreateContactData,
  checkUpdateContactData,
} = require("../../middlewars/contactsMiddlewars");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contactsControllers");

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
