const express = require("express");
const offController = require("../../controllers/V1/off");
const authMiddleware = require("../../middlewares/auth");
const isAdminMiddleware = require("../../middlewares/isAdmin");
const { off } = require("../../app");
const { post } = require("./auth");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, isAdminMiddleware, offController.getAll)
  .post(authMiddleware, isAdminMiddleware, offController.create);

// For All Courses
router
  .route("/all")
  .post(authMiddleware, isAdminMiddleware, offController.setOnAll);

router.route("/:code").post(authMiddleware, offController.getOne);

router.route("/:id").delete(authMiddleware , isAdminMiddleware , offController.remove)


module.exports = router;
