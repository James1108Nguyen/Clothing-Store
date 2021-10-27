const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

let order_Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  dateOrder: {
    type: Date,
    default: Date.now(),
  },
  subTotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  orderTotal: {
    type: Number,
  },
  list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderDetail",
    },
  ],
});

let orderDetail_Schema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

order_Schema.plugin(uniqueValidator);
orderDetail_Schema.plugin(uniqueValidator);

exports.Order = mongoose.model("Order", order_Schema);
exports.OrderDetail = mongoose.model("OrderDetail", orderDetail_Schema);
