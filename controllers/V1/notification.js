const userModel = require("../../models/users");
const notificationModel = require("../../models/notification");
const { isValidObjectId } = require("mongoose");

exports.create = async (req, res) => {
  const { message, admin } = req.body;

  if (!isValidObjectId(admin)) {
    return res.status(500).json({
      message: "AdminID is not valid !!",
    });
  }

  const isAdmin = await userModel.findOne({ _id: admin });

  if (!isAdmin || isAdmin.role === "ADMIN") {
    return res.status(404).json({
      message: "Admin not found !!",
    });
  }

  const notification = await notificationModel.create({
    admin,
    message,
  });

  return res.status(201).json({
    message: "Notification sended successfully",
  });
};

exports.getAll = async (req, res) => {
  const notifications = await notificationModel.find({}).lean();

  return res.json(notifications);
};

exports.get = async (req, res) => {
  const { _id } = req.user;

  const notificationsAdmin = await notificationModel.find({ admin: _id });
  return res.json(notificationsAdmin);
};

exports.seen = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(500).json({
      message: "NotifID is not valid !!",
    });
  }

  const notification = await notificationModel.findOneAndUpdate(
    { _id: id },
    {
      seen: 1,
    }
  );

  if (!notification) {
    res.status(404).json({
      message: "notif not found !!",
    });
  }

  return res.status(201).json({
    message: "Message seened successfully",
  });
};

exports.remove = async (req, res) => {
  const removeNotif = await notificationModel.findOneAndDelete({
    _id: req.params.id,
  });

  if (!removeNotif) {
    return res.status(404).json({
      message: "Notification not found!!",
    });
  }

  return res.json({
    message: "Notification deleted successfully !!",
  });
};
