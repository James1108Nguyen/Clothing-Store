const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 8080;

console.log("Hello James");

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
app.use("/api/user", userRouter);

app.listen(PORT, () =>
  console.log(`Server Running on port: http://localhost:${PORT}`)
);
