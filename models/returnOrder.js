const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let returnOrder_Schema = new Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  returnOrderDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "returnOrderDetail",
      require: true,
    },
  ],
  returnTempPrice: {
    type: Number,
  },
  returnFee: {
    type: Number,
  },
  totalReturnPrice: {
    type: Number,
  },
  qrCodeUrl: {
    type: String,
  },
});
exports.ReturnOrder = mongoose.model("ReturnOrder", returnOrder_Schema);
