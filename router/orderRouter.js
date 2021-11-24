const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");
const { OrderDetail } = require("../models/order");

router.get("/list", async (req, res) => {
  var orders = await Order.find().populate({ path: "list" });

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
