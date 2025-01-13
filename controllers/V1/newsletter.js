const newsletterModel = require("../../models/newsletter");

exports.getAll = async (req, res) => {
  const getAll = await newsletterModel.find({}).lean();

  res.json(getAll);
};

exports.create = async (req, res) => {
  const { email } = req.body;

  const newsletterUser = await newsletterModel.findOne({ email });

  if (newsletterUser) {
    return res.status(409).json({
      message: "You've already subscribed to the newsletter !!",
    });
  }

  const newEmail = await newsletterModel.create({
    email,
  });

  return res.status(202).json({
    message: "You have successfully subscribed to the newsletter",
  });
};
