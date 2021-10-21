const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

const app = express();
const PORT = 8080;

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

var userRouter = require("./routes/userRouter");
app.use("/api/users", userRouter);

app.listen(PORT, () =>
  console.log(`Server Running on port: http://localhost:${PORT}`)
);
