const courseModel = require("./../../models/course");
const sessionModel = require("../../models/session");
const courseUserModel = require("../../models/course-user");
const categoryModel = require("../../models/category");
const commentsModel = require("../../models/comment");
const { isValidObjectId } = require("mongoose");

exports.getAllCourses = async (req, res) => {
  try {
    // دریافت همه دوره‌ها با اطلاعات مرتبط
    const courses = await courseModel
      .find({})
      .populate("categoryID", "title") // فقط فیلد title از دسته‌بندی را بگیر
      .populate("creator", "name") // فقط فیلد name از ایجادکننده را بگیر
      .lean()
      .sort({ _id: -1 });

    // دریافت تمام ثبت‌نام‌ها و نظرات
    const registers = await courseUserModel.find({}).lean();
    const comments = await commentsModel.find({}).lean();

    // گروه‌بندی ثبت‌نام‌ها بر اساس courseId
    const registerMap = registers.reduce((map, register) => {
      const courseId = register.course.toString();
      if (!map[courseId]) {
        map[courseId] = [];
      }
      map[courseId].push(register);
      return map;
    }, {});

    // گروه‌بندی نظرات بر اساس courseId
    const commentMap = comments.reduce((map, comment) => {
      const courseId = comment.course.toString();
      if (!map[courseId]) {
        map[courseId] = [];
      }
      map[courseId].push(comment);
      return map;
    }, {});

    // محاسبه اطلاعات هر دوره
    const allCourses = courses.map((course) => {
      const courseId = course._id.toString();

      // ثبت‌نام‌های مرتبط با این دوره
      const courseRegisters = registerMap[courseId] || [];

      // نظرات مرتبط با این دوره
      const courseComments = commentMap[courseId] || [];

      // محاسبه امتیاز کل و میانگین
      const totalScore = courseComments.reduce(
        (sum, comment) => sum + Number(comment.score || 0),
        0
      );
      const averageScore = courseComments.length
        ? Math.floor(totalScore / courseComments.length)
        : 5; // امتیاز پیش‌فرض 5 در صورت نبود نظرات

      return {
        ...course,
        category: course.categoryID?.title || "بدون دسته‌بندی",
        creator: course.creator?.name || "نامشخص",
        registers: courseRegisters.length,
        averageScore,
      };
    });

    // ارسال پاسخ
    return res.json(allCourses);
  } catch (error) {
    // مدیریت خطا
    console.error("Error fetching courses:", error);
    res.status(500).json({
      message: "An error occurred while fetching courses",
      error: error.message,
    });
  }
};

exports.create = async (req, res) => {
  const {
    name,
    description,
    support,
    href,
    price,
    status,
    discount,
    categoryID,
  } = req.body;

  const course = await courseModel.create({
    name,
    description,
    creator: req.user._id,
    categoryID,
    support,
    price,
    href,
    status,
    discount,
    cover: req.file.filename,
  });

  const mainCourse = await courseModel
    .findById(course._id)
    .populate("creator", "-password");

  return res.status(201).json(mainCourse);
};

exports.createSession = async (req, res) => {
  const { id } = req.params;
  const { title, time, free } = req.body;

  const course = await courseModel.findOne({ _id: id });

  if (!course) {
    return res.status(404).json({
      message: "Course not found !!",
    });
  }

  const session = await sessionModel.create({
    title,
    time,
    free,
    video: req.file.filename,
    course: id,
  });

  return res.status(201).json({
    message: "Session added successfully",
    session,
  });
};

exports.getOne = async (req, res) => {
  try {
    const { href } = req.params;

    const course = await courseModel
      .findOne({ href })
      .populate("creator", "-password")
      .lean();

    if (!course) {
      return res.status(404).json({
        message: "Course not found !!",
      });
    }

    const sessions = await sessionModel.find({ course: course._id }).lean();

    const comments = await commentsModel
      .find({
        course: course._id,
        isAccept: 1,
      })
      .populate("course")
      .lean();

    const courseStudentCount = await courseUserModel.countDocuments({
      course: course._id,
    });

    const isUserRegisteredToThisCourse = !!(await courseUserModel.findOne({
      user: req.user._id,
      course: course._id,
    }));

    if (!isUserRegisteredToThisCourse) {
      return res.status(403).json({
        message: "You can't access to this route !!",
      });
    }

    let allComments = [];

    comments.forEach((comment) => {
      let commentAnswerInfo = null;

      comments.forEach((answerComment) => {
        if (String(comment._id) === String(answerComment.mainCommentID)) {
          allComments.push({
            ...comment,
            course: comment.course.name,
            creator: comment.creator.name,
            answerComment,
          });
        }
      });
    });

    return res.status(200).json({
      course,
      sessions,
      comments: allComments,
      courseStudentCount,
      isUserRegisteredToThisCourse,
    });
  } catch (error) {
    console.error("Error in getOne:", error);
    return res.status(500).json({
      message: "Something went wrong !!",
      error: error.message,
    });
  }
};

exports.getAllSessions = async (req, res) => {
  const sessions = await sessionModel
    .find({})
    .populate("course", "name")
    .lean();

  res.json(sessions);
};

exports.getSessionInfo = async (req, res) => {
  const course = await courseModel.findOne({ href: req.params.href });

  if (!course) {
    return res.status(404).json({
      message: "Course not found !!",
    });
  }

  const session = await sessionModel.findOne({ _id: req.params.sessionID });

  if (!session) {
    return res.status(404).json({
      message: "this session not found !!",
    });
  }

  const sessions = await sessionModel.find({ course: course._id });

  return res.json({ session, sessions });
};

exports.removeSession = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(500).json({
      message: "SessionID is not valid",
    });
  }

  const deletedSession = await sessionModel.findOneAndDelete({ _id: id });

  if (!deletedSession) {
    return res.status(404).json({
      message: "Session not found !!",
    });
  }

  return res.status(201).json({
    message: "Session Deleted Successfully",
  });
};

exports.register = async (req, res) => {
  const isUserAlreadyRegistered = await courseModel
    .findOne({
      user: req.user._id,
      course: req.params.id,
    })
    .lean();

  if (isUserAlreadyRegistered) {
    return res.status(409).json({
      message: "User already registered in this course !!",
    });
  }

  const register = await courseUserModel.create({
    user: req.user._id,
    course: req.params.id,
    price: req.body.price,
  });

  return res.status(201).json({
    message: "you are register successfully",
  });
};

exports.getCoursesByCategory = async (req, res) => {
  const category = await categoryModel.findOne({ href: req.params.href });

  if (!category) {
    return res.status(404).json({
      message: "Category not found !!",
    });
  }

  const categoryCourses = await courseModel.find({ categoryID: category._id });

  if (!categoryCourses) {
    res.json([]);
  }

  return res.json(categoryCourses);
};

exports.removeCourse = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(500).json({
      message: "CourseID is not valid !!",
    });
  }

  const deleteCourse = await courseModel.findOneAndDelete({ _id: id });

  if (!deleteCourse) {
    return res.status(404).json({
      message: "Course not found !!",
    });
  }

  return res.status(201).json({
    message: "Course Deleted Successfully",
  });
};

exports.getRelated = async (req, res) => {
  const course = await courseModel.findOne({ href: req.params.href });

  if (!course) {
    res.status(404).json({
      message: "Course not found !!",
    });
  }

  const relatedCourses = await courseModel.find({
    categoryID: course.categoryID,
  });

  res.json(relatedCourses);
};

exports.popular = async (req, res) => {};

exports.presell = async (req, res) => {
  const presellCourses = await courseModel.find({ status: "پیش فروش" });

  if (!presellCourses) {
    return res.status(404).json({
      message: "Not found course with this status !!",
    });
  }

  return res.json(presellCourses);
};