require("colors");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { AppError } = require("../utils");
const User = require("../models/userModels");
const { signToken, checkToken } = require("./jwtService");
const userRolesEnum = require("../users/userRolesEnum");

/**
 * Check user exisit
 * @param {Object} filter
 * @return {Promise<void>}
 */
exports.usertExist = async (filter) => {
  /**
   * $ne (not equel)  команда MONNGODB
   *  для того щоб з пошуку контакту виключити контакт який ми хочемо змінити
   */
  const userExists = await User.exists(filter);
  
  if (userExists) throw new AppError(409, "User with this email exists");
};

/**
 * Create user and signup JWT
 * @param {Object} userData 
 * @returns {Object} 
 */
exports.registerUser = async (userData) => {
  const newUserData = {
    ...userData,
    role: userRolesEnum.USER,
    verificationToken: signToken(uuid.v4()),
  };
  const newUser = await User.create(newUserData);
 
  newUser.password = undefined;

  return { user: newUser };
};

/**
 * Check login data and sign token
 * @param {Object} loginData 
 * @returns {Object}
 */
exports.loginUser = async ({ email, password }) => {
  /**
   * Коли в моделі на паролі стоїть 'select:false' тоді в "ручну"
   *  через select дістаємо пароль щоб його перевірити.
   * Ще варіанти перелічити або відняти "-"
   */
  const user = await User.findOne({ email }).select("+password");
  
  if (user.verify === false) throw new AppError(401, "Verification error");
    
  if (!user) throw new AppError(401, "Email or password is wrong");

  // const passwordIsValid = await user.checkPassword(password, user.password);
  const passwordIsValid = await bcrypt.compare(password, user.password);
  
  if (!passwordIsValid) throw new AppError(401, "Email or password is wrong 2");
  
  user.token = signToken(user.id);

  await user.save();

  return {user};
}

/**
 * Get user by token
 * @param {string} token 
 * @returns {Object}
 */
exports.getUserByVerifyToken = async (token) => {
  const { verifycationToken } = token;

  const user = await User.findOne({ verifycationToken });
 
  return user;
}


/**
 * Get one user by ID
 * @param {string} id 
 * @returns {Object}
 */
exports.getUserById = (id) => User.findById(id);

/**
 * Logout user, deleting token.
 * @param {string} token; 
 */
exports.logoutUser = async (req) => {
  const token =
  req.headers.authorization?.startsWith("Bearer") &&
  req.headers.authorization.split(" ")[1];
  
  const userId = checkToken(token);

  const currentUser = await User.findById(userId);

  if (!currentUser) throw new AppError(401, "Not authorized");
  
  currentUser.token = undefined;

  return currentUser.save();
};

/**
 * Find user by email
 * @param {string} email - user email
 * @returns {Promise<User>}
 */
exports.getUserByEmail = async (email) => {
  const user = await User.findOne(email);
  console.log("user", user);

  return user;
};

/**
 * Reset password
 */
exports.resetUserPassword = async (otp, password) => {
  const hashedToken = crypto.createHash('sha256').update(otp).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    // $gt--- greater then
    passwordResetExpires: {$gt: Date.now()}
  })

  if (!user) throw new AppError(400, 'Token is invalid');
  
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  user.password = undefined;

  return user
}