const categoryModel = require("../../models/category");
const categoryValidation = require("../../validators/category");
const { isValidObjectId } = require("mongoose");

exports.getAll = async (req, res) => {
  const categories = await categoryModel.find({}).lean();

  return res.json(categories);
};

exports.create = async (req, res) => {
  try {
    const validationResult = categoryValidation(req.body);

    if (validationResult !== true) {
      return res.status(400).json({
        message: "validation faild",
        validationResult,
      });
    }

    const { title, href } = req.body;

    const category = await categoryModel.create({ title, href });

    res.status(200).json({
      message: "Category Added Successfully",
      category: category,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "CategoryID is not valid !!",
    });
  }

  const category = await categoryModel.findOneAndDelete({ _id: id });

  if (!category) {
    return res.status(404).json({
      message: "Category not found !!",
    });
  }

  return res.json({
    message: "Category deleted Successfully",
  });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, href } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "CategoryID is not valid !!",
    });
  }

  const updatedCategory = await categoryModel.findOneAndUpdate(
    { _id: id },
    {
      title,
      href,
    }
  );

  if (!updatedCategory) {
    return res.status(404).json({
      message: "Category not found !!",
    });
  }

  return res.json({
    message: "Category update successfully",
  });
};
