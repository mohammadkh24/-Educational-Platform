const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    precent: {
      type: Number,
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    uses: {
      type: Number,
      require: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Off", schema);

module.exports = model;
