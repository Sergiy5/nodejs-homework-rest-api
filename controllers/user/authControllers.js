require("colors");
// const nodemailer = require('nodemailer');
const Email = require("../../services/emailService");
const ImageService = require("../../services/imageService");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserByEmail,
  resetUserPassword,
  getUserByVerifyToken,
} = require('../../services/userServices');
const { tryCatchWrapper} = require("../../utils");


/**
 * Register User =========================================
 */
exports.register = tryCatchWrapper(async (req, res) => {
  const { user } = await registerUser(req.body);
   
try {
  await new Email(
    user,
    `localhost:3000/api/users/verify/${user.verificationToken}`
  ).sendHello();
} catch (error) {
  console.log(error);
}

  res.status(201).json({
    email: user.email,
    subscription: user.subscription,
    avatar: user.avatarURL,
  });
});
 
/**
 *  Verify User ==========================================
 */
exports.varifyUser = tryCatchWrapper(async (req, res) => {
  const verificationToken = req.params;
  
 const user = await getUserByVerifyToken({ verificationToken });

  if (!user) {

    return res.status(404).json({
      msg: 'User not found',
    });
  }
  user.verificationToken = null;
  user.verify = true;
  await user.save();

  res.status(200).json({
    msg: "Verification successful",
  });
}) 

/**
 * Resend email
 */
exports.resendVerificationEmail = tryCatchWrapper(async (req, res) => {
  console.log("req.body", req.body);

  const  user  = await getUserByEmail(req.body);
  console.log(user)
  if (user.verify === true) {
    return res
      .status(400)
      .json({ msg: "Verification has already been passed" });
  }

try {
  await new Email(
    user,
    `localhost:3000/api/users/verify/${user.verificationToken}`
  ).sendHello();
} catch (error) {
  console.log(error);
}

  res.status(200).json({
    msg: "Verification email sent",
  });
})

/**
 * Login User ===========================================
 */
exports.login = tryCatchWrapper(async(req, res) => {
  const { user } = await loginUser(req.body);
  
  res.status(200).json({
    user: {
      email: user.email,
      subscription: "starter",
      token: user.token,
    },
  });
});

/**
 * Logout User ===============================================
 */
exports.logout = tryCatchWrapper(async (req, res, next) => {

   await logoutUser(req);
  
  res.status(204).json({
    msg: 'No content',
  })
});

/**
 * Get logged in user data =========================
 */
exports.getUser = (req, res) => {
  res.status(200).json({
    user: req.user,
  })
};

/**
 *  Update User ===========================================
 */
exports.updateUser = tryCatchWrapper( async(req, res) => {
  const { user, file } = req;

  if (file) {
    user.avatarURL = await ImageService.save(
      file,
      {
        height: 250, width: 250
      },
      "avatars",
      "users",
      user.id
    );
  }
  Object.keys(req.body).forEach((key) => {
    user[key] = req.body[key];
  });
  const updatedUser = await user.save();

  res.status(200).json({
    user: updatedUser,
  })
})

/**
 * Forgot password request ===================================
 */
exports.forgotPassword = tryCatchWrapper(async (req, res) => {
  const user = await getUserByEmail(req.body.email);

  if (!user) {

    return res.status(200).json({
      msg: 'Password reset instruction send to email =1=',
    });
  }
  const otp = user.createPasswordResetToken();
  
  await user.save()
  
  // send otp by email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/user/reset-password/${otp}`
    
    await new Email(user, resetURL).sendRestorePassword();
  } catch (error) {
    console.log(error);
    
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
  }

  // const emailTransport = nodemailer.createTransport({
  //   host: "sandbox.smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  // const emailConfig = {
  //   from: "Contacts app admin <admin@exampl.com>",
  //   to: user.email,
  //   subject: "Password reset instruction",
  //   text: resetURL,
  // }; 

  // await emailTransport.sendMail(emailConfig);

  res.status(200).json({
    msg: 'Password reset instruction send to email =2= '
  })
})
  /**
   *  Reset password ===========================================
   */
  exports.resetPassword = tryCatchWrapper(async (req, res) => {

    const updatedUser = await resetUserPassword(req.params.otp, req.body.password);

    res.status(200).json({
      user: updatedUser,
    });
  })