const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");

//Log web
app.use(morgan("tiny"));

//Evironment variables
require("dotenv").config();

//Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); //to support JSON encode

//CORS
var cors = require("cors");
app.use(cors());

app.get("/", (req, res) => res.send("Hello from homepage"));

var userRouter = require("./router/userRouter");
app.use("/api/users", userRouter);

mongoose
  .connect(process.env.conectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function (result) {
    console.log("Database is connected");
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function () {
  var port = server.address().port;
  console.log("Express is working on port", port);
});
