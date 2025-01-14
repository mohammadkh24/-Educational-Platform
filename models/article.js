const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
    categoryID: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publish: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Article", schema);

module.exports = model;
