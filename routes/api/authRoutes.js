const { Router } = require('express');
const {
  protect,
  uploadUserAvatar,
} = require("../../middlewars/user/authMiddlewares");
const {
  getMe,
  logout,
  updateMe,
} = require("../../controllers/user/authControllers");

const { register, login } = require("../../controllers/user/authControllers");
const { checkRegisterUserData, checkUserLoginData } = require("../../middlewars/user/authMiddlewares");

const router = Router();

// signup - register new user
router.post("/register", checkRegisterUserData, register);
 
//  login - login user authenthofication
 router.post("/login", checkUserLoginData, login);

 // logout user
router.post("/logout", logout)

// Protect all users
router.use(protect);

/**
 * Важлива послідовність мідлварсів
 */
router.get("/current", getMe);
router.patch('/update-me', uploadUserAvatar, updateMe)

module.exports = router;