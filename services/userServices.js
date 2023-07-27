// const { Types } = require("mongoose");
const { AppError } = require("../utils");
const User = require("../models/userModels");
const { signToken } = require("./jwtService");
const userRolesEnum = require("../cntacts/userRolesEnum");


/**
 * Check Contact exisit
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
  // newUser.password = undefined;
  const token = signToken(newUser.id)
  return { user: newUser, token };
}