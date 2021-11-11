const express = require("express");
const router = express.Router();
const { Category } = require("../models/product");
const { Product } = require("../models/product");
const { multerUploads } = require("../middlewares/multer");
const { cloudinary } = require("../config/cloudinary");
const getFileBuffer = require("../middlewares/getFileBuffer");
const path = require("path");

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

router.post("/deletebyId/:id");

router.post("/add", multerUploads, async (req, res) => {
  const urlDefault =
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhlc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80";
  if (req.file) {
    console.log(req.file);
    res.status(200);
    const buffer = req.file.buffer;
    const file = getFileBuffer(path.extname(req.file.originalname), buffer);

    //upload file to clould
    var image = await cloudinary.uploader.upload(file, {
      folder: "Linh",
    });
  }
  console.log(req.body.newCategory);
  if (req.body.newCategory == "true") {
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
          salePrice: req.body.salePrice,
          desc: req.body.desc,
          imageDisplay: image ? image.url : urlDefault,
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
    console.log("Không thêm category");
    let product = Product({
      categoryId: req.body.categoryId,
      name: req.body.name,
      costPrice: req.body.costPrice,
      discount: req.body.discount,
      salePrice: req.body.salePrice,
      desc: req.body.desc,
      imageDisplay: image ? image.url : urlDefault,
      options: req.body.options,
    });
    product
      .save()
      .then((newProduct) => {
        res.status(200).send(newProduct);
      })
      .catch((err) => {
        res.status(400).send({
          err: err,
          status: "Add new product failed!!",
        });
      });
  }
});

router.post("/updateProduct/:id", multerUploads, async (req, res) => {
  if (req.file) {
    console.log(req.file);
    res.status(200);
    const buffer = req.file.buffer;
    const file = getFileBuffer(path.extname(req.file.originalname), buffer);
    //upload file to clould
    var image = await cloudinary.uploader.upload(file, {
      folder: "Linh",
    });
  }
  if (image) {
    console.log("Có image");
    Product.findByIdAndUpdate(
      req.params.id,
      {
        categoryId: req.body.categoryId,
        name: req.body.name,
        costPrice: req.body.costPrice,
        discount: req.body.discount,
        imageDisplay: image.url,
        desc: req.body.desc,
        options: req.body.options,
      },
      { new: true, safe: true }
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
  } else
    Product.findByIdAndUpdate(
      req.params.id,
      {
        categoryId: req.body.categoryId,
        name: req.body.name,
        costPrice: req.body.costPrice,
        discount: req.body.discount,
        desc: req.body.desc,
        options: req.body.options,
      },
      { new: true, safe: true }
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
