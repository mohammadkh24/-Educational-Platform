const express = require("express");
const menusController = require("../../controllers/V1/menu");
const authMiddleware = require("../../middlewares/auth");
const isAdminMiddleware = require("../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  .get(menusController.getAll)
  .post(authMiddleware, isAdminMiddleware, menusController.create);

router
  .route("/all")
  .get(authMiddleware, isAdminMiddleware, menusController.getAllInPannel);

router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddleware, menusController.remove)
  .put(authMiddleware, isAdminMiddleware, menusController.update);

module.exports = router;
