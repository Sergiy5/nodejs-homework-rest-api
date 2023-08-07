const { Router } = require('express');
const {
  protect,
  uploadUserAvatar,
  checkRegisterUserData,
  checkUserLoginData,
} = require("../../middlewars/user/authMiddlewares");
const {
  getUser,
  logout,
  updateUser,
  register,
  login,
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

// Protect all users=====================================
router.use(protect);

router.get("/current", getUser);

// Update user all fields================================
router.patch('/update-user', uploadUserAvatar, updateUser)

module.exports = router;