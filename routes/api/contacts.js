const express = require('express')
const {checkContactId} = require('../../middlewars/contactsMiddlewars')
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../controllers/contactsControllers');

const router = express.Router()
 /**
  * Важлива послідовність мідлварсів
  */
router.get("/", listContacts);
router.post("/", addContact);
router.get("/:id", checkContactId, getContactById);
router.put("/:id", checkContactId, updateContact);
router.delete("/:id", checkContactId, removeContact);

module.exports = router
