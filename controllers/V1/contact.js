const { text } = require("body-parser");
const contactModel = require("../../models/contact");
const { isValidObjectId } = require("mongoose");
const nodemailer = require("nodemailer");

exports.getAll = async (req, res) => {
  const contacts = await contactModel.find({});

  return res.json(contacts);
};

exports.create = async (req, res) => {
  try {
    const { name, email, phone, body } = req.body;

    const contact = await contactModel.create({
      name,
      email,
      phone,
      answer: 0,
      body,
    });

    return res.status(201).json(contact);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(500).json({
      message: "ContactID is not valid",
    });
  }

  const removeContact = await contactModel.findOneAndDelete({ _id: id });

  return res.status(203).json({
    message: "Contact deleted successfully",
    removeContact,
  });
};

exports.answer = async (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mohammaddevelop87@gmail.com",
      pass: "gbbi ydcd wpil oyhm",
    },
  });

  const sendOptions = {
    from: "mohammaddevelop87@gmail.com",
    to: req.body.email,
    subject: "پاسخ پیغام شما از سمت تیم توسعه دهنده",
    text: req.body.answer,
  };

  transporter.sendMail(sendOptions, async (error, info) => {
    if (error) {
      return res.json({ message: error });
    } else {
      const contact = await contactModel.findOneAndUpdate(
        { email: req.body.email },
        {
          answer: 1,
        }
      );
      return res.json({ message: "Email sent successfully" });
    }
  });
};
