const { checkToken } = require("../../services/jwtService");
const { usertExist, getUserById } = require("../../services/userServices");
const { tryCatchWrapper, AppError, validUserData } = require("../../utils");

exports.checkRegisterUserData = tryCatchWrapper(async (req, res, next) => {
  const { error, value } = validUserData.registerValidUser(req.body);
  if (error) {
    console.log("Middlewar Error".yellow, error.message);
    throw new AppError(400, error.message);
  }

  await usertExist({ email: value.email });

  req.body = value;
  next();
});

exports.checkUserLoginData = tryCatchWrapper(async (req, res, next) => {
  const { error, value } = validUserData.registerValidUser(req.body);

  if (error) {
    console.log("Middlewar Error".yellow, error.message);
    throw new AppError(400, error.message);
  }

  req.body = value;
  next();
});



exports.protect = tryCatchWrapper(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];
  const userId = checkToken(token);

  const currentUser = await getUserById(userId);

  if (!currentUser) throw new AppError(401, "Not authorized");

  req.user = currentUser;

  next();
});

/**
 * Roles guard middleware
 * allowFor('admin', 'moderator')
 * use ONLY after 'protect'
 * @param  {string} roles
 * @return {Function}
 */
exports.allowFor =
  (...roles) =>
  (req, res, next) => {
    if (roles.includes(req.user.role)) return next();
    next(new AppError(403, "You are not allowed to perform this action"));
  };
