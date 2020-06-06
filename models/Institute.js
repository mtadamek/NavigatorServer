const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  address: {
    type: String,
    required: true,
    min: 4,
    max: 1024,
  },
  email: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },
  phone: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  office: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  image:{
    type: String,
    required: true,
    min: 4,
    max: 255,
  }
});

module.exports = mongoose.model("Institute", instituteSchema);
