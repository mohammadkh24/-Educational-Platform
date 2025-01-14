const express = require("express");
const articlesController = require("../../controllers/V1/article");
const authMiddleware = require("../../middlewares/auth");
const isAdminMiddleware = require("../../middlewares/isAdmin");
const multer = require("multer");
const multerStorage = require("../../utils/uploader");

const router = express.Router();

router
  .route("/")
  .get(articlesController.getAll)
  .post(
    authMiddleware,
    isAdminMiddleware,
    multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single('cover'),
    articlesController.create
  );

router.route("/:href").get(articlesController.getOne);

router.route("/:id").delete(articlesController.remove);

router.route("/draft").post(
  authMiddleware,
  isAdminMiddleware,
  multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single('file'),
  articlesController.saveDraft
);

module.exports = router;
