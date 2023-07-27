const { Router } = require('express');

const { register } = require("../../controllers/contacts/authControllers");
const { checkRegisterUserData } = require("../../middlewars/authMiddlewares");

const router = Router();

// signup - register new user
router.post("/register", checkRegisterUserData, register);
 
 // login - ligin user authenthofication
//  router.post("/login", authController.login);

module.exports = router;