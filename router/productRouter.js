const express = require("express");
const router = express.Router();
const { Category } = require("../models/product");
const { Product } = require("../models/product");

router.get("/listCategory", async (req, res) => {
  var categorys = await Category.find();
  if (categorys) {
    res.status(200).send(categorys);
  } else {
    res.status(500).send("Bad server");
  }
});

//Get list of products
router.get("/listProduct", async (req, res) => {
  var products = await Product.find();
  if (products) {
    res.status(200).send(products);
  } else {
    res.status(500).send("Bad server");
  }
});

router.post("/add", async (req, res) => {
  console.log(req.body.newCategory);
  console.log(req.body.imageDisplay[1]);
  Product.update(
    { _id: "6188fbafe7188d9c4e58e575" },
    { $push: { accounts: { name: "foo", idAccount: 123456 } } }
  );
  //   if (req.body.newCategory == true) {
  //     console.log("Chạy new category");
  //     let category = Category({
  //       name: req.body.categoryName,
  //     });
  //     await category
  //       .save()
  //       .then((newCategory) => {
  //         let product = Product({
  //           categoryId: newCategory._id,
  //           name: req.body.name,
  //           basePrice: req.body.basePrice,
  //           discountPrice: req.body.discountPrice,
  //           desc: req.body.desc,
  //           countInStock: req.body.countInStock,
  //           size: req.body.size,
  //           color: req.body.color,
  //           //   Image []
  //         });
  //         product.save().then((newProduct) => {
  //           res.status(200).send(newProduct);
  //         });
  //       })
  //       .catch((err) => {
  //         res.status(400).send({
  //           err: err,
  //           status: "Add new category failed!!",
  //         });
  //       });
  //   } else {
  //     let product = Product({
  //       categoryId: req.body.categoryId,
  //       name: req.body.name,
  //       basePrice: req.body.basePrice,
  //       discountPrice: req.body.discountPrice,
  //       desc: req.body.desc,
  //       countInStock: req.body.countInStock,
  //       size: req.body.size,
  //       color: req.body.color,
  //       //   Image []
  //     });
  //     product.save().then((newProduct) => {
  //       res.status(200).send(newProduct);
  //     });
  //   }
});
module.exports = router;
