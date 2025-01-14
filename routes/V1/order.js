const express = require("express");
const authMiddlleware = require("../../middlewares/auth");
const orderController = require("../../controllers/V1/order");

const router = express.Router();

router.route("/").get(authMiddlleware, orderController.getAll);
router.route("/:id").get(authMiddlleware, orderController.getOne);

module.exports = router;