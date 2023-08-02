const { Types } = require("mongoose");
const { AppError } = require("../utils");
const Contact = require("../models/contactsModels");
const userRolesEnum = require("../cntacts/userRolesEnum");

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
 * Create new contact
 * @param {Object} contactData - new contact data
 * @param {Object} owner - owner contact
 * @returns {Promise<new Contact>}
 */
exports.createNewContact = (contactData, owner) => {
  const { name, email, phone, favorit } = contactData;

  return Contact.create({
    name,
    email,
    phone,
    favorit,
    owner,
  });
};
/**
 * Remove contact
 * @param {string} id
 * @returns {Promise<Contact>}
 */
exports.removingContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};
/**
 * Get all contacts from data base
 * @param {Object} - search pagination, sort options
 * @returns {Promise<Contact[]>}
 */
exports.allContacts = async (options, user) => {
  /**
   * The method populate will return owner by contacts
   * owner from model cotactSchema owner: 'User','sign'.
   */
  // const contacts = await Contact.find().populate('owner');

  const findOptions = options.search
    ? {
        $or: [
          { name: { $regex: options.search, $options: "i" } },
          { email: { $regex: options.search, $options: "i" } },
        ],
      }
    : {};
  
  if (options.search && user.role === userRolesEnum.USER) {
    findOptions.$or.forEach((searchOption)  => {
      searchOption.owner = user;
    });
  }

  if (!options.search && user.role === userRolesEnum.USER) {
    findOptions.owner = user;
  }
  const contacts = await Contact.find(findOptions);

  return contacts;
};

/**
 * Get one contacts
 * @param {string} id
 * @returns {Promise<Object>} contact
 */
exports.getOneContactById = (id) => Contact.findById(id);
