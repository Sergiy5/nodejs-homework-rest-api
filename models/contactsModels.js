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
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    // email: {
    //   type: String,
    //   unique: [true, "Dublicated email"],
    // },
    // password: {
    //   type: String,
    //   required: [true, "Invalid password"],
    //   select: false,
    // },
    // role: {
    //   type: String,
    //   enum: Object.values(userRolesEnum),
    //   default: userRolesEnum.USER,
    // },
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