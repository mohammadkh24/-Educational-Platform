const validator = require("fastest-validator");

const v = new validator();

const schema = {
  title: {
    type: "string",
  },
  href: {
    type: "string",
  },
  $$strict : true
};

const check = v.compile(schema);

module.exports = check;