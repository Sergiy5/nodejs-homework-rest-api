const fs = require('fs/promises');
const path = require("path");
const { AppError, tryCatchWrapper } = require("../utils");

require("colors");

const contactsPath = path.join("models", "contacts.json");

exports.checkContactId = tryCatchWrapper(async (req, res, next) => {
  const { id } = req.params;
  
  if (id.length < 20) {
    throw new AppError(400, "Invalid ID");
  }
  const contacts = JSON.parse(await fs.readFile(contactsPath));

  const contact = contacts.find((item) => item.id === id);

  if (!contact) {
    return res.status(404).json({
      message: "Not found",
    });
  }
  req.contact = contact;
  next();
});