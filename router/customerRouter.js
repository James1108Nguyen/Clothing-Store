const express = require("express");
const router = express.Router();
const { Customer } = require("../models/customer");

router.get("/list", (request, response) => {
  Customer.find({}).exec(function (err, customers) {
    response.send(customers);
  });
});

//Create new customerModel
router.post("/create", async (req, res) => {
  console.log("Post create customer");
  let customer = Customer({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    email: req.body.email,
    point: req.body.point,
    gender: req.body.gender,
  });
  customer
    .save()
    .then((newCustomer) => {
      res.status(200).send(newCustomer);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
