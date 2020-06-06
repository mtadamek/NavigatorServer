const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../constants/httpStatusCodes");

const jwtAuth = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) throw "Invalid token!";
    req.user = verified;
    next();
  } catch (error) {
    res.status(UNAUTHORIZED).send(error);
  }
};

module.exports = jwtAuth;
