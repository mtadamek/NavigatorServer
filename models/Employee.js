const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  forename: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  surname: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  degree: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },
  phone: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
  office: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  consultation: {
    type: [String],
    required: false,
  },
  image: {
    type: String,
    required: false,
    min: 3,
    max: 255,
  },
  instituteId: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
