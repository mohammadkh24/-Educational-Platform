const commentsModel = require("../../models/comment");
const coursesModel = require("../../models/course");
const { isValidObjectId } = require("mongoose");

exports.getAll = async (req, res) => {
  const comments = await commentsModel
    .find({})
    .populate("course", "name")
    .populate("creator", "name")
    .lean();

  let allComments = [];

  comments.forEach((comment) => {
    let commentAnswerInfo = null;

    comments.forEach((answerComment) => {
      if (String(comment._id) === String(answerComment.mainCommentID)) {
        allComments.push({
          ...comments,
          course: comment.course.name,
          creator: comment.creator.name,
          answerComment,
        });
      }
    });
  });

  res.json(allComments);
};

exports.create = async (req, res) => {
  const { body, courseHref, score } = req.body;

  const course = await coursesModel.findOne({ href: courseHref }).lean();

  if (!course) {
    res.status(404).json({
      message: "Course not found !!",
    });
  }

  const comment = await commentsModel.create({
    body,
    course: course._id,
    creator: req.user._id,
    score,
    isAnswer: 0,
    isAccept: 0,
  });

  res.status(201).json({
    comment,
  });
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(500).json({
      message: "CommentID is not valid",
    });
  }

  const removeComment = await commentsModel.findOneAndDelete({ _id: id });

  if (!removeComment) {
    return res.status(404).json({
      message: "Comment not found !!",
    });
  }

  return res.status(201).json({
    message: "Comment deleted successfully",
    removeComment,
  });
};

exports.accept = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(500).json({
      message: "CommentID is not valid",
    });
  }

  const acceptedComment = await commentsModel.findOneAndUpdate(
    { _id: id },
    {
      isAccept: 1,
    }
  );

  if (!acceptedComment) {
    return res.status(404).json({
      message: "Comment not found !!",
    });
  }

  return res.status(201).json({
    message: "Comment accepted successfully",
    acceptedComment,
  });
};

exports.reject = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(500).json({
      message: "CommentID is not valid",
    });
  }

  const rejectedComment = await commentsModel.findOneAndUpdate(
    { _id: id },
    {
      isAccept: 0,
    }
  );

  if (!rejectedComment) {
    return res.status(404).json({
      message: "Comment not found !!",
    });
  }

  return res.status(201).json({
    message: "Comment rejected successfully",
    rejectedComment,
  });
};

exports.answer = async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(500).json({
      message: "CommentID is not valid",
    });
  }

  const acceptedComment = await commentsModel.findOneAndUpdate(
    { _id: id },
    {
      isAccept: 1,
    }
  );

  if (!acceptedComment) {
    return res.status(404).json({
      message: "Comment not found !!",
    });
  }

  const answerComment = await commentsModel.create({
    body,
    course: acceptedComment.course,
    creator: req.user._id,
    isAnswer: 1,
    isAccept: 1,
    mainCommentID: id,
  });

  return res.status(201).json(answerComment);
};
