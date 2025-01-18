const menusModel = require("../../models/menu");
const { default: mongoose, Types } = require("mongoose");

exports.getAll = async (req, res) => {
  const menus = await menusModel.find({}).lean();

  menus.forEach((menu) => {
    const subMenus = [];
    for (let i = 0; i < menus.length; i++) {
      const mainMenu = menus[i];
      if (String(mainMenu.parent) === String(menu._id)) {
        subMenus.push(menus.splice(i, 1)[0]);
        i = i - 1;
      }
    }
    menu.subMenus = subMenus;
  });

  return res.json(menus);
};

exports.create = async (req, res) => {
  try {
    const { title, href, parent } = req.body;

    const isParent = await menusModel.findOne({ _id: parent });

    if (parent && !isParent) {
      return res.status(404).json({
        message: "Parent not found !!",
      });
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

exports.getAllInPannel = async (req, res) => {
  const menus = await menusModel.find().populate("parent", "title").lean();

  return res.json(menus);
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "MenuID is not valid !!",
    });
  }

  const removeMenu = await menusModel.findOneAndDelete({ _id: id });

  if (!removeMenu) {
   return res.status(404).json({
      message: "Menu not found !!",
    });
  }

  return res.status(202).json({
    message: "Menu deleted successfully",
    removeMenu,
  });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, href, parent } = req.body;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "MenuID is not valid !!",
    });
  }

  const isParent = await menusModel.findOne({ _id: parent });

  if (parent && !isParent) {
    return res.status(404).json({
      message: "Parent not found !!",
    });
  }

  const updateMenu = await menusModel.findOneAndUpdate(
    { _id: id },
    {
      title,
      href,
      parent,
    }
  );

  if (!updateMenu) {
    return res.status(404).json({
      message: "Menu not found !!",
    });
  }

  return res.status(201).json({
    message: "Menu updated successfully",
    updateMenu,
  });
};
