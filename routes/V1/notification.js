const express = require("express");
const notificationController = require("../../controllers/V1/notification");
const authMiddleware = require("../../middlewares/auth");
const isAdminMiddleware = require("../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, isAdminMiddleware, notificationController.create)
  .get(authMiddleware, isAdminMiddleware, notificationController.getAll);

router.route("/:id").delete(authMiddleware, isAdminMiddleware, notificationController.remove)

router
  .route("/admins")
  .get(authMiddleware, isAdminMiddleware, notificationController.get);

router
  .route("/:id/see")
  .put(authMiddleware, isAdminMiddleware, notificationController.seen);

module.exports = router;
