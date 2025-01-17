const mongoose = require("mongoose");
const { answer } = require("../controllers/V1/comment");

const schema = mongoose.Schema(
  {
    departmentID: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    departmentSubID: {
      type: mongoose.Types.ObjectId,
      ref: "DepartmentSub",
      required: true,
    },
    title: {
        type : String,
        required : true
    },
    priority: {
      type: Number,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answer: {
      type: Number,
      required: true,
    },
    isAnswer: {
      type: Number,
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    ticketID : {
        type : String
    }
  },
  { timestamps: true }
);

const model = mongoose.model("Ticket", schema);

module.exports = model;
