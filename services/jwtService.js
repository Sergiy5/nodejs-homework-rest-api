const jwt = require("jsonwebtoken");

/**
 * JWT sign services mathod.
 * @param {string} id - user ID
 * @return {string}-jwt
 */
exports.signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
