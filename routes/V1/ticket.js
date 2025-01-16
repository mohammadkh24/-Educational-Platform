const express = require("express");
const ticketController = require("../../controllers/V1/ticket");
const authMiddleware = require("../../middlewares/auth");
const isAdminMiddleware = require("../../middlewares/isAdmin");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, ticketController.create)
  .get(authMiddleware, isAdminMiddleware, ticketController.getAll);

router.route("/user").get(authMiddleware, ticketController.userTicket);

router.route("/departments").get(ticketController.departments);
router.route("/departments-subs/:id").get(ticketController.departmentsSubs);
router
  .route("/answer")
  .post(authMiddleware, isAdminMiddleware, ticketController.setAnswer);
router
  .route("/:id/answer")
  .post(authMiddleware, ticketController.getAnswer);

router.route("/:id").delete(authMiddleware , isAdminMiddleware , ticketController.remove)
  

module.exports = router;
