require("colors");
const bcrypt = require("bcrypt");
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
   * Коли в моделі на паролі в моделі стоїть 'select:false' тоді в "ручну"
   *  через select дістаємо пароль щоб його перевірити.
   * Ще варіанти перелічити або відняти "-"
   */
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new AppError(401, "Email or password is wrong");

  // const passwordIsValid = await user.checkPassword(password, user.password);
  const passwordIsValid = await bcrypt.compare(password, user.password);
  
  if (!passwordIsValid) throw new AppError(401, "Email or password is wrong 2");
  
  user.token = signToken(user.id);

  await user.save();

  return {user};
}
/**
 * Get one user
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
