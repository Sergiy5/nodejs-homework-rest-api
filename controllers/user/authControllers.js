require("colors");

const { registerUser, loginUser, logoutUser } = require("../../services/userServices");
const { tryCatchWrapper} = require("../../utils");



exports.register = tryCatchWrapper(async(req, res) => {
 const {user} = await registerUser(req.body)

  res.status(201).json({
    email: user.email,
    subscription: user.subscription,
  });
});

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

exports.logout = tryCatchWrapper(async (req, res, next) => {

   await logoutUser(req);
  
  res.status(204).json({
    msg: 'No content',
  })
});

/**
 * Get logged in user data. 
 */
exports.getMe = (req, res) => {
  res.status(200).json({
    user: req.user,
  })
};
