const express = require("express");
const authRouter = require("./routes/V1/auth");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/V1/user");
const categoryRouter = require("./routes/V1/category");
const coursesRouter = require("./routes/V1/courses");
const commentsRouter = require("./routes/V1/comment");
const contactsRouter = require("./routes/V1/contact");
const newsletterRouter = require("./routes/V1/newsletter");
const searchRouter = require("./routes/V1/search");
const notificationRoter = require("./routes/V1/notification");
const offRouter = require("./routes/V1/off");

const app = express();

// Set Public
app.use(
  "/courses/covers",
  express.static(path.join(__dirname, "public , courses , covers"))
);

// Get req.body
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/v1/auth", authRouter);
app.use("/v1/users", usersRouter);
app.use("/v1/categories", categoryRouter);
app.use("/v1/courses", coursesRouter);
app.use("/v1/comments", commentsRouter);
app.use("/v1/contacts", contactsRouter);
app.use("/v1/newsletter", newsletterRouter);
app.use("/v1/search", searchRouter);
app.use("/v1/notif", notificationRoter);
app.use("/v1/off" , offRouter)

// Not Found Page
app.use((req, res) => {
  return res.status(404).json({
    error: {
      type: "Not Found",
      message: "404 test msg",
    },
  });
});

module.exports = app;
