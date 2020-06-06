const express = require("express");
const router = express.Router();

const Institute = require("../models/Institute");
const schema = require("../middlewares/schema");
const auth = require("../middlewares/auth");
const upload = require("../utils/uploadImage");
const { INSTITUTE } = require("../constants/validationTypes");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("../constants/httpStatusCodes");

router.get("/", async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.status(OK).send(institutes);
  } catch (error) {
    res.status(BAD_REQUEST).send(error);
  }
});

router.post(
  "/",
  auth,
  upload.single("image"),
  schema(INSTITUTE),
  async (req, res) => {
    try {
      //Check file has been loaded
      if (!req.file) throw "Image don't exist";
      const { name, address, email, phone, office } = req.body;
      //Check institute exist in DB
      const institute = await Institute.findOne({ name });
      if (institute) throw "Institute arleady exist!";
      //Create new institute object
      const newInstitute = new Institute({
        name,
        address,
        email,
        phone,
        office,
        image: req.file.filename,
      });
      //Save new institute to DB
      const savedInstitute = await newInstitute.save();
      res.status(CREATED).send(savedInstitute);
    } catch (error) {
      res.status(BAD_REQUEST).send(error);
    }
  }
);

module.exports = router;
