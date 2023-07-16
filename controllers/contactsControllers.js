const fs = require("fs").promises;
const path = require("path");
const { v1: uuidv1 } = require("uuid");
require("colors");
// const {isValidCotacts} = require("isValidCotacts"); 

const contactsPath = path.join("models", "contacts.json");
/**
 * List contacts
 */
exports.listContacts = async (req, res) => {
    try {
      const contacts = JSON.parse(await fs.readFile(contactsPath));
      
    res.status(200).json({
      msg: "Succes",
      contacts
    });
  } catch (error) {
        console.log(error);

        res.sendStatus(500);
  }
};
/**
 * Get contact by id
 */
exports.getContactById = async (req, res) => {
  let { id } = req.contact;
  console.log(id);
  
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath));

    const contactById = (id = contacts.find((contact) => contact.id === id));

    if (contactById) {
  res.status(200).json({
    msg: "Succes",
    contact: contactById,
  });
    }if (!contactById) {
        res.status(404).json({
        msg: "Not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
/**
 *Remove contact
 */
exports.removeContact = async (req, res) => {
   let { id } = req.contact;
  console.log(id);
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath));

    const isContactExsist = contacts.find((contact) => contact.id === id);
    if (isContactExsist) {
      const filteredContacts = (id = contacts.filter(
        (contact) => contact.id !== id
      ));

      await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));

       res.status(200).json({"message": "contact deleted"});
    } if (!isContactExsist) {
      res.status(404).json({ message: "Not found" });
    }
    
  } catch (error) {
       res.sendStatus(500);
  }
};
/**
 * Add contact
 */
exports.addContact = async (req, res) => {
  const { name, email, phone } = req.body;
  // const validContact = isValidCotacts({ name, email, phone });
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath));

    const newContact = { id: uuidv1(), name, email, phone };

    const isContactExsist = contacts.find(
      ({ id }) => id === newContact.id
    );

    if (!isContactExsist) {
      contacts.push(newContact);

      await fs.writeFile(contactsPath, JSON.stringify(contacts));

      res.status(201).json({
        msg: "Succes",
        contact: newContact,
      });
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
/**
 * Update contact
 */
exports.updateContact = async (req, res) => {
   const { id } = req.contact;
  const { name, email, phone } = req.body;
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath));

    const contactForUpdate = contacts.find((contact) => contact.id === id);;

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
    } if (!contactForUpdate) {
       res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
