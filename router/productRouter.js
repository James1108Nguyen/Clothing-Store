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

router.post("/uploadxlsx", async (req, res) => {
  console.log(req.file);
  res.status(200).send("OK");
});

router.post("/img/updates", async (req, res) => {
  Product.findByIdAndUpdate(
    { _id: req.body.productId },
    { $push: { imageDisplay: req.body.imageDisplay } },
    { new: true, safe: true, upsert: true }
  )
    .then((result) => {
      return res.status(201).json({
        status: "Success",
        message: "Successfully!",
        data: result,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "Failed",
        message: "Database Error",
        data: error,
      });
    });
});

router.post("/add", async (req, res) => {
  // console.log(req.body.newCategory);
  // console.log(req.body.imageDisplay);
  if (!req.body.discount) sale_price = req.body.costPrice;
  else
    sale_price =
      ((100 - Number(req.body.discount)) * Number(req.body.costPrice)) / 100;
  console.log(sale_price);
  if (req.body.newCategory == true) {
    console.log("Chạy new category");
    let category = Category({
      name: req.body.categoryName,
    });
    await category
      .save()
      .then((newCategory) => {
        let product = Product({
          categoryId: newCategory._id,
          name: req.body.name,
          costPrice: req.body.costPrice,
          discount: req.body.discount,
          salePrice: sale_price,
          desc: req.body.desc,
          imageDisplay: req.body.imageDisplay,
          options: req.body.options,
        });
        product.save().then((newProduct) => {
          res.status(200).send(newProduct);
        });
      })
      .catch((err) => {
        res.status(400).send({
          err: err,
          status: "Add new category failed!!",
        });
      });
  } else {
    let product = Product({
      categoryId: req.body.categoryId,
      name: req.body.name,
      costPrice: req.body.costPrice,
      discount: req.body.discount,
      salePrice: sale_price,
      desc: req.body.desc,
      imageDisplay: req.body.imageDisplay,
      options: req.body.options,
    });
    product.save().then((newProduct) => {
      res.status(200).send(newProduct);
    });
  }
});

router.post("/updateProduct/:id", async (req, res) => {
  console.log(req.params.id);
  Product.findByIdAndUpdate(
    req.params.id,
    {
      categoryId: req.body.categoryId,
      name: req.body.name,
      costPrice: req.body.costPrice,
      discount: req.body.discount,
      desc: req.body.desc,
      imageDisplay: req.body.imageDisplay,
      options: req.body.options,
    },
    { new: true, safe: true, upsert: true }
  )
    .then((result) => {
      return res.status(201).json({
        status: "Success",
        data: result,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "Failed",
        data: error,
      });
    });
});

module.exports = router;
