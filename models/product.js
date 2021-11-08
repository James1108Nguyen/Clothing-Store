const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
//Category
let category_Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

//Product
let product_Schema = new Schema({
  categoryId: {
    type: String,
    required: true,
    ref: "Category",
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  desc: {
    type: String,
    required: true,
    unique: true,
  },
  countInStock: {
    type: String,
  },
  imageDisplay: [
    {
      type: String,
    },
  ],
  size: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});
category_Schema.plugin(uniqueValidator);
product_Schema.plugin(uniqueValidator);
exports.Category = mongoose.model("Category", category_Schema);
exports.Product = mongoose.model("Product", product_Schema);
