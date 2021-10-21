const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

//Evironment variables
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); //to support JSON encode

//Log web
app.use(morgan("tiny"));

mongoose
  .connect(process.env.conectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function (result) {
    console.log("Database is connected");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello from homepage"));

var userRouter = require("./router/userRouter");
app.use("/api/users", userRouter);

app.listen(PORT, () =>
  console.log(`Server Running on port: http://localhost:${PORT}`)
);
