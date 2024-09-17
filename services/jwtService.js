const jwt = require("jsonwebtoken");
const { AppError } = require("../utils");

/**
 * JWT sign services mathod.
 * @param {string} id - user ID
 * @return {string}-jwt
 */
exports.signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.checkToken = (token) => {
      if (!token) throw new AppError(401, "Not authorized");

      try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        return id;
      } catch (error) {
        console.log(error.message);
        throw new AppError(401, "Not authorized");
      }
  }
