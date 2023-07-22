const { tryCatchWrapper } = require("../utils");

require("colors");
const Contact = require("../models/contactsModels");

/**
 * Get list contacts
 */
exports.listContacts = tryCatchWrapper(async (req, res) => {
  const contacts = await Contact.find();
    // JSON.parse(await fs.readFile(contactsPath)) ;

  res.status(200).json({
    msg: "Succes",
    contacts,
  });
});
/**
 * Get contact by ID
 */
exports.getContactById = tryCatchWrapper(async (req, res) => {

 const contact = await Contact.findById(req.params.id)

  if (contact) {
    res.status(200).json({
      msg: "Succes",
      contact: contact,
    });
  }
});
/**
 *Remove contact
 */
exports.removeContact = tryCatchWrapper(async (req, res) => {
  const { id } = req.params;

  await Contact.findByIdAndDelete(id);
  
  res.sendStatus(204);
});
/**
 * Add contact
 */
exports.addContact = tryCatchWrapper(async (req, res) => {

  
  const newContact = await Contact.create(req.body);

  newContact.password = undefined
    
  res.status(201).json({
      msg: "Succes",
      contact: newContact,
    });
  
});
/**
 * Update contact
 */
exports.updateContact = tryCatchWrapper(async (req, res) => {
   const contact = await Contact.findById(req.params.id);
  
  Object.keys(req.body).forEach((key) => {
    contact[key] = req.body[key];
  })
  /**
   * Saving updated contact (the method save()!!!)
   */
  const updatedContact = await contact.save();
  
    res.status(201).json({
      msg: "Succes",
      contact: updatedContact,
    }); 
});

exports.updateStatusContact = tryCatchWrapper(async (req, res) => {

  const newStatusContact = await Contact.findByIdAndUpdate(req.params.id,
    { favorite: req.body.favorite },
    { new: true });
  
    res.status(200).json({
      msg: "Succes",
      contact: newStatusContact,
    });
});