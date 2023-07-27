require("colors");
const { registerUser } = require("../../services/userServices");
const { tryCatchWrapper } = require("../../utils");



exports.register = tryCatchWrapper(async(req, res) => {
 const {user, token} = await registerUser(req.body)

  res.status(201).json({
    email: user.email,
    password: user.password,
    token,
  });
});

// exports.login = (req, res) => {

// };