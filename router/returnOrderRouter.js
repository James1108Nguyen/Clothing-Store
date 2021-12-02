const express = require("express");
const router = express.Router();
const { ReturnOrderDetail } = require("../models/returnOrderDetail");
const { ReturnOrder } = require("../models/returnOrder");
const { OrderDetail } = require("../models/order");
const generateQR = require("../middlewares/gererateQR");
const { cloudinary } = require("../config/cloudinary");
const { Customer } = require("../models/customer");
module.exports = router;

router.post("/", async function (req, res) {
  const returnOrderDetails = req.body.returnOrderDetails;

  const returnOrderDetailIds = [];
  for (var i in returnOrderDetails) {
    OrderDetail.findByIdAndUpdate(
      returnOrderDetails[i].orderDetail,
      {
        quantity:
          returnOrderDetails[i].oldQuantity -
          returnOrderDetails[i].returnedQuantity,
      },
      { new: true },
      function (err, doc) {
        if (err) {
          console.log("Lỗi update");
        } else {
          console.log(doc);
        }
      }
    );
  }
  var newReturnOrderDetails = await ReturnOrderDetail.insertMany(
    returnOrderDetails
  );
  newReturnOrderDetails.map((returnOrderDetail) => {
    returnOrderDetailIds.push(returnOrderDetail._id);
  });

  const returnOrder = new ReturnOrder({
    cashier: req.body.user,
    order: req.body.order,
    returnTempPrice: req.body.returnTempPrice,
    returnFee: req.body.returnFee,
    totalReturnPrice: req.body.totalReturnPrice,
    returnOrderDetails: returnOrderDetailIds,
  });

  returnOrder.save(async function (err, returnOrder) {
    if (err) {
      console.log("Loi Order");
      console.log(err);
      res.status(500).send(err);
    } else {
      const fileQrCode = await generateQR(
        JSON.stringify({
          returnOrderId: returnOrder._id,
          customer: req.body.customer,
          returnFee: req.body.returnFee,
          totalReturnPrice: req.body.totalReturnPrice,
          point: req.body.point,
        })
      );
      var qrCodeImage = await cloudinary.uploader.upload(fileQrCode, {
        folder: "Linh",
      });
      const qrCodeUrl = qrCodeImage.url;
      orderWithQr = await ReturnOrder.findOneAndUpdate(
        { _id: returnOrder.id },
        { qrCodeUrl: qrCodeUrl },
        { returnOriginal: false }
      );

      res.status(200).send(orderWithQr);
      console.log(orderWithQr);
      var updateInfo = await Customer.updateOne(
        {
          _id: req.body.customer,
        },
        { point: req.body.point }
      );

      if (updateInfo.modifiedCount) {
        console.log("Cập nhật điểm cho khách hàng thành công");
      } else {
        console.log("Cập nhật điểm cho khách hàng thất bại");
      }
    }
  });
});
