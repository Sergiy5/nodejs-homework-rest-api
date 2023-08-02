const { model, Schema } = require('mongoose')
// const userRolesEnum = require("../cntacts/userRolesEnum");


const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      rquired: [true, "Conatct must have an owner"],
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


const Contact = model("Contact", contactSchema);

module.exports = Contact; 