const { isValidObjectId, default: mongoose } = require("mongoose");
const { off } = require("../../app");
const coursesModel = require("../../models/course");
const offModel = require("../../models/off");
const { json } = require("body-parser");

exports.getAll = async (req, res) => {
  const offs = await offModel
    .find({}, "-__v")
    .populate("course", "name href")
    .populate("creator", "name");

  return res.json(offs);
};

exports.create = async (req, res) => {
  try {
    const { code, precent, course, max } = req.body;

    const isCourse = await coursesModel.findOne({ _id: course });

    if (!isCourse) {
      return res.status(404).json({
        message: "Course not found !!",
      });
    }

    const newOff = await offModel.create({
      code,
      precent,
      course: isCourse._id,
      max,
      uses: 0,
      creator: req.user._id,
    });

    return res.status(201).json({
      message: "Discount created successfully",
      newOff,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.setOnAll = async (req, res) => {
  const { discount } = req.body;

  const coursesDiscount = await coursesModel.updateMany({ discount });

  return res.status(201).json({
    message: "Discount set successfully",
  });
};

exports.getOne = async (req, res) => {
  const { code } = req.params;
  const { course } = req.body;

  if (!mongoose.Types.ObjectId.isValid(course)) {
    return res.status(400).json({
      message: "CourseID is not valid !!",
    });
  }

  const off = await offModel.findOne({ code, course });

  if (!off) {
    return res.status(404).json({
      message: "Code is not valid !!",
    });
  } else if (off.max === off.uses) {
    return res.status(409).json({
      message: "Code already uses !!",
    });
  } else {
    await offModel.findOneAndUpdate(
      {
        code,
        course,
      },
      { uses: off.uses + 1 }
    );
    return res.json(off);
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(500).json({
      message: "DiscountID is not valid !!",
    });
  }

  const removeDiscount = await offModel.findOneAndDelete({ _id: id });

  if (!removeDiscount) {
    return res.status(404).json({
      message: "Discount not found !!",
    });
  }

  return res.status(202).json({
    message: "Discount deleted successfully",
    removeDiscount,
  });
};
