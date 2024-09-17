const ImageService = require('../../services/imageService')
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

exports.checkUserEmailData = tryCatchWrapper(async (req, res, next) => {
  const { error, value } = validUserData.validUserEmail(req.body);
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
  
// Multer config storage example =========================

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cbk) => {
//     cbk(null, 'static/avatars')
//   },
//   filename: (req, file, cbk) => {
//     const extension = file.mimetype.split('/')[1];
//     cbk(null, `${req.user.id}-${uuid()}.${extension}`)
//   }
// });

// // Config multer filter
// const multerFilter = (req, file, cbk) => {
//   // 'image/*'
//   if (file.mimetype.startsWith('image/')) {
//     cbk(null.true);
//   } else {
//     cbk(new AppError(400, 'Pleas, upload image only!'), false)
//   }
// }

// exports.uploadUserAvatar = multer({
//   storage: multerStorage,
//   filter: multerFilter,
//     limits: {
//     fileSize: 1 * 1024 * 1024,
//     },
// }).single('avatar')

exports.uploadUserAvatar = ImageService.initUploadMiddlware('avatar');