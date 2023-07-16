const fs = require("fs").promises;
const path = require("path");
const { v1: uuidv1 } = require("uuid");
const { tryCatchWrapper, validContacts, AppError } = require("../utils");
require("colors");

const contactsPath = path.join("models", "contacts.json");
/**
 * List contacts
 */
exports.listContacts = async (req, res, next) => {
  console.log("1");
  try {
    console.log("first");
    const contacts = JSON.parse(await fs.readFile(contactsPath));

    res.status(200).json({
      msg: "Succes",
      contacts,
    });
  } catch (error) {
    console.log(error);
  }
};
/**
 * Get contact by id
 */
exports.getContactById = tryCatchWrapper(async (req, res) => {
  let { id } = req.contact;

  const contacts = JSON.parse(await fs.readFile(contactsPath));

  const contactById = (id = contacts.find((contact) => contact.id === id));

  if (contactById) {
    res.status(200).json({
      msg: "Succes",
      contact: contactById,
    });
  }
  if (!contactById) {
    res.status(404).json({
      msg: "Not found",
    });
  }
});
/**
 *Remove contact
 */
exports.removeContact = tryCatchWrapper(async (req, res) => {
  let { id } = req.contact;

  const contacts = JSON.parse(await fs.readFile(contactsPath));

  const isContactExsist = contacts.find((contact) => contact.id === id);

  if (isContactExsist) {
    const filteredContacts = (id = contacts.filter(
      (contact) => contact.id !== id
    ));

    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));

    res.status(200).json({ message: "contact deleted" });
  }
  if (!isContactExsist) {
    res.status(404).json({ message: "Not found" });
  }
});
/**
 * Add contact
 */
exports.addContact = tryCatchWrapper(async (req, res) => {
  const { name, email, phone } = req.body;

  const { error, value } = validContacts.createValidCotacts(req.body);
  console.log("Validator".yellow, error, value);

  if (error) throw new AppError(400, "Invalid contats data");

  const contacts = JSON.parse(await fs.readFile(contactsPath));

  const newContact = { id: uuidv1(), name, email, phone };

  const isContactExsist = contacts.find(({ id }) => id === newContact.id);

  if (!isContactExsist) {
    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts));

    res.status(201).json({
      msg: "Succes",
      contact: newContact,
    });
  }
});
/**
 * Update contact
 */
exports.updateContact = tryCatchWrapper(async (req, res) => {
  const { id } = req.contact;
  const { name, email, phone } = req.body;

  const contacts = JSON.parse(await fs.readFile(contactsPath));

  const contactForUpdate = contacts.find((contact) => contact.id === id);

  if (contactForUpdate) {
    const updatedContat = {
      ...contactForUpdate,
      name,
      email,
      phone,
    };
    await fs.writeFile(contactsPath, JSON.stringify(contacts));

    res.status(201).json({
      msg: "Succes",
      contact: updatedContat,
    });
  }
  if (!contactForUpdate) {
    res.status(404).json({ message: "Not found" });
  }
});
