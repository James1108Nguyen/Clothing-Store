const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },

  imageUrl: {
    type: String,
  },
});

userSchema.plugin(uniqueValidator);
exports.User = mongoose.model("User", userSchema);
