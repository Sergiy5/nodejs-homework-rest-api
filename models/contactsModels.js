const { model, Schema } = require('mongoose')
const userRolesEnum = require("../cntacts/userRolesEnum");
const bcrypt = require("bcrypt");

// const { hashingPassword } = require('../services/passwordServices');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      unique: [true, "Dublicated email"],
    },
    password: {
      type: String,
      required: [true, "Invalid password"],
      select: false,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(userRolesEnum),
      default: userRolesEnum.USER,
    },
  },
  {
    /**
     * timestamps rerurn lines with data when object was made and update
     * versionKey didn't return vrsion of object
     */
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Pre save  hook. Fires on Create and Save.
 */
contactSchema.pre('save', async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});
/**
 * Custom method mongoose to validate password. Return promise boolean------
 */
// contactSchema.methods.checkPassword = (candidate, hash) =>
//   bcrypt.compare(candidate, hash);
// -------------------------------------------------------------------------
const Contact = model("Contact", contactSchema);

module.exports = Contact; 