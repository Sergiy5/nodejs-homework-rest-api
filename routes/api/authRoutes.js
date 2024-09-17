const { Router } = require('express');
const {
  protect,
  uploadUserAvatar,
  checkRegisterUserData,
  checkUserLoginData,
  checkUserEmailData,
} = require("../../middlewars/user/authMiddlewares");
const {
  getUser,
  logout,
  updateUser,
  register,
  login,
  forgotPassword,
  resetPassword,
  varifyUser,
  resendVerificationEmail,
} = require("../../controllers/user/authControllers");

const router = Router();

/**
 * Важлива послідовність мідлварсів=============================!!!
 */

// signup - register new user============================
router.post("/register", checkRegisterUserData, register);
 
//  login - login user authenthofication=================
 router.post("/login", checkUserLoginData, login);

 // logout user==========================================
router.post("/logout", logout)

// find user andsend password OTP by email to restore password
router.post('/forgot-password', forgotPassword);

// udate password in DB=================================
router.patch('/reset-password/:otp', resetPassword);

// Varify user by token =========================================
router.get('/verify/:verificationToken', varifyUser);

// Resend email for verifiction =======================================
router.post("/verify", checkUserEmailData, resendVerificationEmail); 

// Protect all users!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.use(protect);

router.get("/current", getUser);

// Update user all fields================================
router.patch('/update-user', uploadUserAvatar, updateUser)

module.exports = router;