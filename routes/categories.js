const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const schema = require("../middlewares/schema");
const auth = require("../middlewares/auth");
const upload = require("../utils/uploadImage");
const { CATEGORY } = require("../constants/validationTypes");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("../constants/httpStatusCodes");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(OK).send(categories);
  } catch (error) {
    res.status(BAD_REQUEST).send(error);
  }
});

router.post(
  "/",
  auth,
  upload.single("image"),
  schema(CATEGORY),
  async (req, res) => {
    try {
      //Check file has been loaded
      if (!req.file) throw "Image don't exist";
      const { name } = req.body;
      //Check category exist in DB
      const category = await Category.findOne({ name });
      if (category) throw "Category arleady exist!";
      //Create new category object
      const newCategory = new Category({
        name,
        image: req.file.filename,
      });
      //Save new category to DB
      const savedCategory = await newCategory.save();
      res.status(CREATED).send(savedCategory);
    } catch (error) {
      res.status(BAD_REQUEST).send(error);
    }
  }
);

module.exports = router;
