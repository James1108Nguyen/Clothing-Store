const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

let order_Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
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
  qrCodeUrl: {
    type: String,
  },
  orderDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderDetail",
    },
  ],
  status: {
    type: String,
    default: "Chưa thanh toán",
  },
  totalReturnPrice: {
    type: Number,
    default: 0,
  },
});

let orderDetail_Schema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
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
