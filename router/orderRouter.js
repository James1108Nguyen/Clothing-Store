const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");
const { OrderDetail } = require("../models/order");
const { Customer } = require("../models/customer");
const e = require("express");
router.get("/list", async (req, res) => {
  var orders = await Order.find()
    .populate({ path: "list" })
    .populate({ path: "userId", select: "fullname" })
    .populate({ path: "customerId", select: "name" });
  if (orders) {
    res.status(200).send(orders);
  } else {
    res.status(500).send("Bad server");
  }
});

//Create new Order
router.post("/create", async (req, res) => {
  let order = Order({
    userId: req.body.userId,
    customerId: req.body.customerId,
    subTotal: req.body.subTotal,
    discount: req.body.discount,
    orderTotal: req.body.orderTotal,
    status: req.body.status,
  });
  await order
    .save()
    .then(async (newOrder) => {
      const cus = await Customer.findByIdAndUpdate(
        { _id: newOrder.customerId },
        { $push: { listOrders: newOrder } },
        { new: true }
      )
        .then((newCustom) => {
          if (!newCustom)
            return res.status(400).send("Thêm Order vào customer thất bại!");
          res.status(200).json({
            status: "Thêm Order vào customer thành công!",
            newCustom: newCustom,
            newOrder: newOrder,
          });
        })
        .catch((err) => {
          res.status(400).send({
            err: err,
            status: "Thêm Order vào customer thất bại!",
          });
        });
    })
    .catch((err) => {
      res.status(400).send({
        error: err,
        status: "Lưu Order Thất bại",
      });
    });
});

router.post("/product/add", async (req, res) => {
  let orderDetail = OrderDetail({
    productId: req.body.productId,
    orderId: req.body.orderId,
    quantity: req.body.quantity,
  });
  await orderDetail.save().then(async (newDetails) => {
    const od = await Order.findById({ _id: newDetails.orderId });
    od.list.push(newDetails);
    await od
      .save()
      .then(() => {
        res.status(200).send("Thêm product vào order thành công!");
      })
      .catch((err) => {
        res.status(400).send({
          err: err,
          status: "Failure",
        });
      });
  });
});
router.post("/", async function (req, res) {
  //let orderDetails = await req.body.orderDetails.map(async (product) => {
  /// let newOrderDetails = OrderDetail({
  //  product: product.productId,
  ///  quantity: product.quantity,
  //});
  // });
  const orderDetails = req.body.orderDetails;
  const orderDetailIds = [];
  var newOrderDetails = await OrderDetail.insertMany(orderDetails);
  newOrderDetails.map((orderDetail) => {
    orderDetailIds.push(orderDetail._id);
  });
  console.log(orderDetailIds);
});

// newOrderItem = await newOrderItem.save();
// return newOrderItem._id;
// });
//const list = req.body.lists;
//console.log(list);
//});
module.exports = router;
