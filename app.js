const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");

const app = express();

//Evironment variables
require("dotenv").config();

//Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); //to support JSON encode

//CORS
var cors = require("cors");
app.use(cors());

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

const PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function () {
  var port = server.address().port;
  console.log("Express is working on port", port);
});
