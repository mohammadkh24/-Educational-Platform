const { isValidObjectId } = require("mongoose");
const articleModel = require("../../models/article");

exports.getAll = async (req, res) => {
  const articles = await articleModel.find({}).populate("creator", "name");

  return res.json(articles);
};

exports.getOne = async (req, res) => {
  const { href } = req.params;

  const article = await articleModel.findOne({ href });

  if (!article) {
    res.status(404).json({
      message: "Article not found !!",
    });
  }

  return res.json(article);
};

exports.create = async (req, res) => {
  const { title, description, body, categoryID, href } = req.body;

  const newArticle = await articleModel.create({
    title,
    description,
    body,
    cover: req.file.filename,
    categoryID,
    creator: req.user._id,
    publish: 0,
    href,
  });

  return res.status(201).json({
    message: "Article created successfully",
    newArticle,
  });
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "ArticleID is not valid !!",
    });
  }

  const removeArticle = await articleModel.findOneAndDelete({ _id: id });

  if (!removeArticle) {
    return res.status(404).json({
      message: "Article not found !!",
    });
  }

  return res.status(202).json({
    message: "Article Removed successfully",
    removeArticle,
  });
};

exports.saveDraft = async (req, res) => {
    const { title, description, body, categoryID, href } = req.body;

  const newArticle = await articleModel.create({
    title,
    description,
    body,
    cover: req.file.filename,
    categoryID,
    creator: req.user._id,
    publish: 1,
    href,
  });

  return res.status(201).json({
    message: "Article saved draft successfully",
    newArticle,
  });
};

