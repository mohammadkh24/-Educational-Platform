const userModel = require("../../models/users");
const registerValidation = require("../../validators/register");
const bcrypt = require("bcrypt");
const banUser = require("../../models/ban-phone");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const validationResult = registerValidation(req.body);
  if (validationResult !== true) {
    return res.status(422).json(validationResult);
  }

  const { username, name, email, password, phone } = req.body;

  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    return res.status(409).json({
      message: "Username or Email is duplicated",
    });
  }

  const isUserBan = await banUser.find({ phone });

  if (isUserBan.length) {
    return res.status(409).json({
      message: "This phone number ban",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const countOfUsers = await userModel.countDocuments();

  const user = await userModel.create({
    name,
    username,
    email,
    password: hashedPassword,
    phone,
    role: countOfUsers > 0 ? "USER" : "ADMIN",
  });

  const userObject = user.toObject();
  Reflect.deleteProperty(userObject, "password");

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30 days",
  });

  return res.status(201).json({ user: userObject, accessToken });
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });

  if (!user) {
    return res.status(401).json({
      message: "There is no user with username or email !",
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Password incorrect !",
    });
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return res.json({ accessToken });
};

exports.getMe = async () => {};
