const express = require("express");
const cors = require("cors");
const router = express.Router();
const { User } = require("../models/userModel");

router.post("/register", async (req, res) => {
  let user = User({
    username: req.body.username,
    password: req.body.password,
    phone: req.body.phone,
    address: req.body.address,
    email: req.body.email,
    imageUrl: "",
  });
  user
    .save()
    .then((newUser) => {
      res.status(200).send(newUser);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/register", async (req, res) => res.send("Access denied"));

module.exports = router;
