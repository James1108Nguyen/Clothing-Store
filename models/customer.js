const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

let customer_Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  point: {
    type: Number,
  },
});

customer_Schema.plugin(uniqueValidator);
exports.Customer = mongoose.model("Customer", customer_Schema);
