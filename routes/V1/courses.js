const express = require("express");
const coursesController = require("../../controllers/V1/course");
const multer = require("multer");
const multerStorage = require("../../utils/uploader");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");
const auth = require("./../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .post(
    multer({ storage: multerStorage, limits: { fileSize: 300000 } }).single(
      "cover"
    ),
    authMiddleware,
    isAdminMiddleware,
    coursesController.create
  ).get(authMiddleware , isAdminMiddleware , coursesController.getAllCourses)

router.post(
  "/:id/sessions",
  multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single(
    "video"
  ),
  authMiddleware,
  isAdminMiddleware,
  coursesController.createSession
);

router.route("/presell").get(coursesController.presell);
router.route("/:href").get(authMiddleware, coursesController.getOne);

router.route("/related/:href").get(coursesController.getRelated);

router.route("/category/:href").get(coursesController.getCoursesByCategory);

router
  .route("/sessions")
  .get(authMiddleware, isAdminMiddleware, coursesController.getAllSessions);

router.route("/:href/:sessionID").get(coursesController.getSessionInfo);

router
  .route("/sessions/:id")
  .delete(authMiddleware, isAdminMiddleware, coursesController.removeSession);

router.route("/:id/register").post(authMiddleware, coursesController.register);

router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddleware, coursesController.removeCourse);

router.route("/popular").get(coursesController.popular);

module.exports = router;
