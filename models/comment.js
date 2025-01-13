const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isAccept: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 5,
    },
    isAnswer: {
      type: Number,
      required: true,
    },
    mainCommentID: {
      type: mongoose.Types.ObjectId,
      ref: "comments",
    },
  },
  { timestamps: true }
);

const model = mongoose.model('Comment' , schema);

module.exports = model;