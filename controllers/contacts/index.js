const addContacts = require('./addContact');
const getContactById = require('./getContactById');
const listContact = require('./listContacts');
const removeContact = require('./removeContact');
const updateContact = require('./updateContact');
const updateStatusContact = require('./updateStatusContact');

module.exports = {
  updateStatusContact,
  updateContact,
  removeContact,
  listContact,
  getContactById,
  addContacts,
};
