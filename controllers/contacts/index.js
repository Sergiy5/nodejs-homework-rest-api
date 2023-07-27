const addContacts = require('./addContact')
const getContactById = require('./getContactById')
const listContacts = require('./listContacts')
const removeContact = require('./removeContact')
const updateContact = require('./updateContact')
const updateStatusContact = require('./updateStatusContact')

module.exports = {
  updateStatusContact,
  updateContact,
  removeContact,
  listContacts,
  getContactById,
  addContacts,
}
