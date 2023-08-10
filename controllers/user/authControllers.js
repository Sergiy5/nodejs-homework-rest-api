require("colors");

const ImageService = require("../../services/imageService");
const { registerUser, loginUser, logoutUser } = require("../../services/userServices");
const { tryCatchWrapper} = require("../../utils");

exports.register = tryCatchWrapper(async(req, res) => {
 const {user} = await registerUser(req.body)
  console.log("user Controller".blue, user);
  
  res.status(201).json({
    email: user.email,
    subscription: user.subscription,
    avatar: user.avatarURL,
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
exports.getUser = (req, res) => {
  res.status(200).json({
    user: req.user,
  })
};


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