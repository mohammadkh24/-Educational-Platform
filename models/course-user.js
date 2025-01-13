const mongoose = require("mongoose");

const schema = mongoose.Schema({
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  price: {
    type: Number,
    required: true,
  },
});

const model = mongoose.model("CourseUser", schema);

module.exports = model