const express = require("express");
const router = express.Router();
const { Category } = require("../models/product");
const { Product } = require("../models/product");
const { multerUploads } = require("../middlewares/multer");
const { multipleMulterUploads } = require("../middlewares/multiplefileMulter");
const { cloudinary } = require("../config/cloudinary");
const getFileBuffer = require("../middlewares/getFileBuffer");
const path = require("path");
var ObjectId = require("mongoose").Types.ObjectId;

router.get("/listCategory", async (req, res) => {
  const name = req.query.name;

  var categorys = await Category.find({ name: new RegExp("^" + name, "i") });
  if (categorys) {
    res.status(200).send(categorys);
  } else {
    res.status(500).send("Bad server");
  }
});

router.post("/find", (req, res) => {
  const text = req.body.searchText;
  if (ObjectId.isValid(req.body.text)) {
    return Product.find(
      {
        $or: [{ name: new RegExp(text, "i") }, { _id: req.body.text }],
      },
      function (err, result) {
        if (err) throw err;
        console.log(result);
        res.status(200).send(result);
      }
    );
  } else {
    return Product.find(
      { name: new RegExp(text, "i") },
      function (err, result) {
        if (err) throw err;
        res.status(200).send(result);
      }
    );
  }
});

//List product by id
router.get("/productByCategory/", async (req, res) => {
  const category = req.query.category;
  if (category == "all") {
    await Category.aggregate(
      [
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "categoryId",
            as: "productList",
          },
        },
      ],
      function (err, result) {
        if (err) return res.status(500).send(err);
        else return res.status(200).send(result);
      }
    );
  } else {
    await Category.aggregate(
      [
        {
          $match: {
            name: category,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "categoryId",
            as: "productList",
          },
        },
      ],
      function (err, result) {
        if (err) return res.status(500).send(err);
        else return res.status(200).send(result);
      }
    );
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
    { new: true }
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

router.post("/add", multipleMulterUploads, async (req, res) => {
  const urlDefault =
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhlc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80";
  if (req.files) {
    if (req.files[0]) {
      const buffer1 = req.files[0].buffer;
      const fileAvatar = getFileBuffer(
        path.extname(req.files[0].originalname),
        buffer1
      );
      console.log(fileAvatar);
      //upload file to clould
      var image = await cloudinary.uploader.upload(fileAvatar, {
        folder: "Linh",
      });
    }
    if (req.files[1]) {
      const buffer2 = req.files[1].buffer;

      const fileQrCode = getFileBuffer(
        path.extname(req.files[1].originalname),
        buffer2
      );
      var qrCodeImage = await cloudinary.uploader.upload(fileQrCode, {
        folder: "Linh",
      });
    }
  }

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
          qrCodeImage: qrCodeImage ? qrCodeImage.url : "",
          options: req.body.options,
        });
        product.save().then((newProduct) => {
          res.status(200).send(newProduct);
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          err: err,
          status: "Add new category failed!!",
        });
      });
  } else {
    console.log("Không thêm category");
    cata = await Category.findById(req.body.categoryId);
    if (!cata) return res.status(500).send("Category Id không hợp lệ");
    let product = Product({
      categoryId: req.body.categoryId,
      name: req.body.name,
      costPrice: req.body.costPrice,
      discount: req.body.discount,
      salePrice: req.body.salePrice,
      desc: req.body.desc,

      imageDisplay: image ? image.url : urlDefault,
      qrCodeUrl: qrCodeImage ? qrCodeImage.url : "",
      options: req.body.options,
    });
    await product
      .save()
      .then((newProduct) => {
        console.log("Lưu thành công product mới");
        res.status(200).send(newProduct);
      })
      .catch(async (err) => {
        console.log(err);
        if (image) {
          await cloudinary.uploader.destroy(
            image.public_id,
            function (err, result) {
              if (err) {
                res.status(500).send(err);
              }
            }
          );
        }
        res.status(400).send({
          err: err,
          status: "Add new product failed!!",
        });
      });
  }
});

router.post("/updateProduct/:id", multerUploads, async (req, res) => {
  var prd = await Product.findById(req.params.id);
  if (!prd) {
    console.log("Product Id incorrect!");
    return res.status(500).send("Product Id incorrect!");
  }

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
    await Product.findByIdAndUpdate(
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
      { new: true }
    )
      .then((result) => {
        return res.status(201).json({
          status: "Success",
          data: result,
        });
      })
      .catch(async (error) => {
        if (image) {
          await cloudinary.uploader.destroy(
            image.public_id,
            function (err, result) {
              if (err) {
                res.status(500).send(err);
              }
            }
          );
        }
        return res.status(500).json({
          status: "Failed",
          data: error,
        });
      });
  } else
    await Product.findByIdAndUpdate(
      req.params.id,
      {
        categoryId: req.body.categoryId,
        name: req.body.name,
        costPrice: req.body.costPrice,
        discount: req.body.discount,
        desc: req.body.desc,
        options: req.body.options,
      },
      { new: true }
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
