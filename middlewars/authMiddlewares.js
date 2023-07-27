const { usertExist } = require("../services/userServices");
const {
  tryCatchWrapper,
  AppError,
  validUserData,
} = require("../utils");

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