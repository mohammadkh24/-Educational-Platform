const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    phone: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("BanUsers", schema);

module.exports = model;
