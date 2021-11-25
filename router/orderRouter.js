const express = require("express");
const { async } = require("q");
const { Customer } = require("../models/customer");
const router = express.Router();
const { Order } = require("../models/order");
const { OrderDetail } = require("../models/order");

router.get("/list", async (req, res) => {
  var orders = await Order.find().populate({ path: "orderDetails" });

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
  });
  order
    .save()
    .then((newCustomer) => {
      res.status(200).send(newCustomer);
    })
    .catch((err) => {
      res.status(400).send({
        error: err,
        status: "Failure",
      });
    });
});

router.post("/product/add", async (req, res) => {
  let orderDetail = OrderDetail({
    productId: req.body.productId,
    orderId: req.body.orderId,
    quantity: req.body.quantity,
  });
  orderDetail.save().then(async (newDetails) => {
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
  const orderDetails = req.body.orderDetails;
  const orderDetailIds = [];
  var newOrderDetails = await OrderDetail.insertMany(orderDetails);
  newOrderDetails.map((orderDetail) => {
    orderDetailIds.push(orderDetail._id);
  });

  const order = new Order({
    user: req.body.user,
    customer: req.body.customer,
    subTotal: req.body.subTotal,
    discount: req.body.discount,
    orderTotal: req.body.orderTotal,
    orderDetails: orderDetailIds,
  });

  order.save(async function (err, order) {
    if (err) {
      console.log("loi Order");
      console.log(err);
      res.status(500).send(err);
    } else {
      console.log(order);
      res.status(200).send(order);
      var updateInfo = await Customer.updateOne(
        {
          _id: req.body.customer,
        },
        { $push: { listOrders: order._id } }
      );
      console.log(updateInfo);
      if (updateInfo.modifiedCount) {
        console.log("Thêm order vào khách hàng thành công");
      } else {
        console.log("Thêm đơn hàng vào khách hàng thất bại");
      }
    }
  });
});

module.exports = router;
