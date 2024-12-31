const mongoose = require("mongoose");
const { create } = require("../controllers/category");

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
    href: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    categoryID: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

schema.virtual('sessions' , {
    ref : 'session',
    localField : "_id",
    foreignField : "course"
})

schema.virtual('comments' , {
    ref : 'comment',
    localField : "_id",
    foreignField : "course"
})

const model = mongoose.model("Course", schema);

module.exports = model;
