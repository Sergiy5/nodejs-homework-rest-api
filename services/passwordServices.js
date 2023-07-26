const bcrypt = require("bcrypt");

module.exports.hashingPassword = async function hashingPassword(next) {
  if (this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
};
