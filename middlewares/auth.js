const jwt = require("jsonwebtoken");
const userModel = require("../models/users");

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization")?.split(" ");

  if (authHeader?.length !== 2) {
   return res.status(403).json({
      message: "This route is protect and you cant access to it!",
    });
  }

  const token = authHeader[1];

  try {
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(jwtPayload.id).lean();

    if (!user) {
      res.status(404).json({
        message: "User not found !",
      });
    }

    Reflect.deleteProperty(user, "password");

    req.user = user

    next();
  } catch (error) {
    res.status(500).json(error);
  }
};
