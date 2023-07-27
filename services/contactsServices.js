const { Types } = require("mongoose");
const Contact = require("../models/contactsModels");
const { AppError } = require("../utils");

/**
 * Check Contact exisit
 * @param {Object} filter
 * @return {Promise<void>}
 */
exports.contactExist = async (filter) => {
  /**
   * $ne (not equel)  команда MONNGODB
   *  для того щоб з пошуку контакту виключити контакт який ми хочемо змінити
   */
  const userExists = await Contact.exists(filter);
  /**
   * Коли немає try catch обгортки це альтернатива кинути помилку через return
   * if (userExists) return next(new AppError(409, "User with this email exists"));
   */

  if (userExists) throw new AppError(409, "User with this email exists");
};

/**
 * Check Contact exisit
 * @param {Object} id
 * @return {Promise<void>}
 */
exports.contactExistById = async (id) => {
  /**
   * Перевірка Types.ObjectId.isValid від 'mongoose'
   */
  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) throw new AppError(404, "User does not exist");

  const contact = await Contact.exists({ _id: id });

  if (!contact) throw new AppError(404, "User does not exist");
};
/**
 * Update contact data service
 * @param {string} id
 * @param {Object} contactData
 * @returns {Promise<Contact>}
 */
exports.updatingContact = async (id, contactData) => {
  const contact = await Contact.findById(id);

  Object.keys(contactData).forEach((key) => {
    contact[key] = contactData[key];
  });
  /**
   * Saving updated contact (the method save()!!!)
   */
  return contact.save();
};
/**
 * Updating status of contact
 * @param {string} id
 * @param {boolean} status
 * @returns {Promise<Contact>}
 */
exports.updatingStatusContact = async (id, status) => {
  return Contact.findByIdAndUpdate(id, { favorite: status }, { new: true });
};
/**
 * Add new contact
 * @param {Object} newContact 
 * @returns {Promise<new Contact>}
 */
exports.addingContact = async (contact) => {
  const newContact = await Contact.create(contact);

  newContact.password = undefined;

  return newContact;
};
/**
 * Remove contact
 * @param {string} id 
 * @returns {Promise<Contact>}
 */
exports.removingContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};
