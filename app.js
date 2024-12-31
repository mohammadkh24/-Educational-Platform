const express = require("express");
const authRouter = require("./routes/V1/auth");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/V1/user");
const categoryRouter = require("./routes/V1/category");

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

module.exports = app;
