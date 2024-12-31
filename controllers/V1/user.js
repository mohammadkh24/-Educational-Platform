const { isValidObjectId, default: mongoose } = require("mongoose");
const userModel = require("../../models/users");
const banModel = require("../../models/ban-phone");
const bcrypt = require("bcrypt");

exports.banUser = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "UserID is not valid",
    });
  }

  const mainUser = await userModel.findById(id);

  if (!mainUser) {
    return res.status(404).json({
      message: "User Not found!",
    });
  }

  const banUsers = await banModel.findOne({ phone: mainUser.phone }).lean();

  if (banUsers) {
    return res.status(409).json({
      message: "User is already banned",
    });
  }

  const banedUser = await banModel.create({ phone: mainUser.phone });

  if (banedUser) {
    return res.status(200).json({
      message: "User Banned Successfully",
    });
  }

  return res.status(500).json({
    message: "Server Error!",
  });
};
exports.getAll = async (req, res) => {
  try {
    const users = await userModel.find({}).lean();

    users.forEach((user) => {
      Reflect.deleteProperty(user, "password");
    });

    return res.json(users);
  } catch (error) {
    res.json(error);
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(409).json({
        message: "UserID is not valid!",
      });
    }

    const deleteUser = await userModel.findOneAndDelete({ _id: id });

    if (!deleteUser) {
      return res.status(404).json({
        message: "User not found !!",
      });
    }

    return res.status(202).json({
      message: "User Removed Successfully",
    });
  } catch (error) {
    res.json(error);
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { id } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(409).json({
        message: "UserID is not valid!",
      });
    }

    const user = await userModel.findOne({ _id: id });

    if (!user) {
      return res.status.json({
        message: "User not found !!",
      });
    }

    let newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    const updatedRole = await userModel.findByIdAndUpdate(id, {
      role: newRole,
    });

    if (!updatedRole) {
      return res.status(403).json({
        message: "User role change faild !!",
      });
    }

    return res.json({
      message: "User role changed successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, username, email, password, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.findByIdAndUpdate(
      { _id: req.user._id },
      {
        name,
        username,
        email,
        password: hashedPassword,
        phone,
      }
    ).select("-password").lean()

    return res.json({
      message: "User Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
