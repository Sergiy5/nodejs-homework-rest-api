const { model, Schema } = require('mongoose');
const bcrypt = require("bcrypt");
const userRolesEnum = require("../users/userRolesEnum");
const crypto = require('crypto');
require("colors");

// const { hashingPassword } = require('../services/passwordServices');

/**
 * User Model
 */
const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
      select: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    role: {
      type: String,
      enum: Object.values(userRolesEnum),
      default: userRolesEnum.USER,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      // required: [true, "Verify token is required"],
    },
    token: String,
    avatarURL: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
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
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');
    
    this.avatarURL = `https:www.gravatar.com/avatar/${emailHash}.jpg?d=monsterid`;
  }
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});
/**
 * Custom method mongoose to validate password. Return promise boolean
 * @param {string} candidate
 * @param {string} hash
 * @returns {Promise<boolean}
 */
userSchema.methods.checkPassword = (candidate, hash) => {
  bcrypt.compare(candidate, hash);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  // 10 * 60 * 1000 ---10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

const User = model("User", userSchema);

module.exports = User; 