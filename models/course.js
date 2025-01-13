const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    support: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["پیش فروش", "درحال ضبط" , "اتمام ضبط"],
      default: "اتمام ضبط",
    },
    discount: {
      type: Number,
      required: true,
    },
    categoryID: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

schema.virtual("sessions", {
  ref: "session",
  localField: "_id",
  foreignField: "course",
});

schema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "course",
});

const model = mongoose.model("Course", schema);

module.exports = model;
