const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const schema = require("../middlewares/schema");
const auth = require("../middlewares/auth");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("../constants/httpStatusCodes");
const { USER } = require("../constants/validationTypes");

router.post("/register", schema(USER), async (req, res) => {
  try {
    const { login, password } = req.body;

    //Check user exist id DB
    const user = await User.findOne({ login });
    if (user) throw new Error("User arleady exist!");

    //Hash password
    const hash = await bcrypt.hash(password, 10);

    //Create new user object
    const newUser = new User({
      login,
      password: hash,
    });

    const savedUser = await newUser.save();
    res.status(CREATED).send(savedUser);
  } catch (error) {
    res.status(BAD_REQUEST).send(error);
  }
});

router.post("/login", schema(USER), async (req, res) => {
  try {
    const { login, password } = req.body;

    //Search for user
    const user = await User.findOne({ login });
    if (!user) throw "User doesn't exist!";

    //Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw "Invalid password!";
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    console.log(token);
    res.status(OK).header("auth-token", token).send(token);
  } catch (error) {
    res.status(BAD_REQUEST).send(error);
  }
});

router.get("/test", auth, (req, res) => {
  console.log("OK!");
  res.status(OK).send("OK!");
});

module.exports = router;
