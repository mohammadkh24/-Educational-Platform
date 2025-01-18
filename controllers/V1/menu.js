const { param } = require("../../app");
const menusModel = require("../../models/menu");

exports.getAll = async (req, res) => {};
exports.create = async (req, res) => {
  try {
    const { title, href, parent } = req.body;

    const isParent = await menusModel.findOne({ _id : parent});

    if (parent && !isParent) {
       return res.status(404).json({
            message : "Parent not found !!"
        })
    }

    const menu = await menusModel.create({
      title,
      href,
      parent,
    });

    return res.status(201).json({
      message: "Menu created successfully",
      menu,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getAllInPannel = async (req, res) => {};
exports.remove = async (req, res) => {};
exports.update = async (req, res) => {};
