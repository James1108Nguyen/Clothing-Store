const express = require("express");
const { async } = require("q");
const { Customer } = require("../models/customer");
const router = express.Router();
const { Order } = require("../models/order");
const { OrderDetail } = require("../models/order");
const generateQR = require("../middlewares/gererateQR");
const { DateTime } = require("luxon");
const { cloudinary } = require("../config/cloudinary");
router.get("/list", async (req, res) => {
  var orders = await Order.find()
    .populate({ path: "orderDetails" })
    .populate("customer", "name phone point")
    .populate("user", "fullname");
  if (orders) {
    res.status(200).send(orders);
  } else {
    res.status(500).send("Bad server");
  }
});
router.get("/:id", async function (req, res) {
  console.log(req.params.id);
  var order = await Order.findById(req.params.id)
    .populate("customer", "name phone point")
    .populate({
      path: "orderDetails",
      populate: {
        path: "product",
        select: "name saleprice imageDisplay salePrice",
      },
    });

  if (order) {
    res.status(200).send(order);
  } else {
    res.status(500).send("Lỗi server");
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

router.get("/test/TIme", async (req, res) => {
  const time = DateTime.now().setZone("Asia/Ho_Chi_Minh");
  res.send(time.toString());
});
router.post("/product/add", async (req, res) => {
  let orderDetail = OrderDetail({
    productId: req.body.productId,

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
    status: "Đã thanh toán",
  });

  order.save(async function (err, order) {
    if (err) {
      console.log("Loi Order");
      console.log(err);
      res.status(500).send(err);
    } else {
      const fileQrCode = await generateQR(
        JSON.stringify({
          orderId: order._id,
          customerId: req.body.customer,
          orderTotal: req.body.orderTotal,
          discount: req.body.discount,
          point: req.body.point,
        })
      );
      var qrCodeImage = await cloudinary.uploader.upload(fileQrCode, {
        folder: "Linh",
      });
      const qrCodeUrl = qrCodeImage.url;
      orderWithQr = await Order.findOneAndUpdate(
        { _id: order.id },
        { qrCodeUrl: qrCodeUrl },
        { returnOriginal: false }
      );
      console.log(orderWithQr);
      res.status(200).send(orderWithQr);
      var updateInfo = await Customer.updateOne(
        {
          _id: req.body.customer,
        },
        { $push: { listOrders: order._id }, point: req.body.point }
      );

      if (updateInfo.modifiedCount) {
        console.log("Thêm order vào khách hàng thành công");
      } else {
        console.log("Thêm đơn hàng vào khách hàng thất bại");
      }
    }
  });
});

//get total revenue today
router.get("/revenue/revenueToday", async function (req, res) {
  const agg = Order.aggregate([
    {
      $match: { orderTotal: { $lte: 400000 } },
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $subtract: ["$orderTotal", "$totalReturnPrice"] } },
      },
    },
  ]).exec((err, doc) => {
    if (doc) {
      res.send(doc);
    } else {
      res.send(err);
    }
  });
});

module.exports = router;
