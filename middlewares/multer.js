const multer = require("multer");

const path = require("path");

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("image");

module.exports = { multerUploads };
