const coursesModel = require("../../models/course");

exports.get = async (req, res) => {
  const { keyword } = req.params;

  const courses = await coursesModel.find({
    name: { $regex: ".*" + keyword + ".*" },
  });

  res.json(courses);
};
