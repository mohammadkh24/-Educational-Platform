const express = require("express");
const usersController = require("../../controllers/V1/user");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");

const usersRouter = express.Router();

usersRouter.post(
"/ban/:id",
  authMiddleware,
  isAdminMiddleware,
  usersController.banUser
);
usersRouter.route("/").get(authMiddleware, isAdminMiddleware, usersController.getAll).put(authMiddleware , usersController.updateUser)

usersRouter.delete("/delete/:id", authMiddleware, isAdminMiddleware, usersController.removeUser);

usersRouter.post("/upgrade", authMiddleware, isAdminMiddleware, usersController.changeRole);

module.exports = usersRouter;
