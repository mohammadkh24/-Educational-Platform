const { isValidObjectId } = require("mongoose");
const courseUserModel = require("../../models/course-user");

exports.getAll = async (req, res) => {
  const orders = await courseUserModel
    .find({ user: req.user._id })
    .populate("course", "name href")
    .lean();

  return res.json(orders);
};

exports.getOne = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: "CourseID not found !!",
    });
  }

  const order = await courseUserModel
    .findOne({ _id: req.params.id })
    .populate("course")
    .lean();

  return res.json(order);
};
