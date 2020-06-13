const Joi = require("@hapi/joi");

const { BAD_REQUEST } = require("../constants/httpStatusCodes");

const user = Joi.object({
  login: Joi.string().min(4).max(255).required(),
  password: Joi.string().min(4).max(255).required(),
});

const category = Joi.object({
  name: Joi.string().min(3).max(255).required(),
});

const institute = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  address: Joi.string().min(4).max(1024).required(),
  email: Joi.string().min(4).max(1024).required().email(),
  phone: Joi.string().min(6).max(255).required(),
  office: Joi.string().min(1).max(1024).required(),
});

const employee = Joi.object({
  forename: Joi.string().min(3).max(1024).required(),
  surname: Joi.string().min(3).max(1024).required(),
  degree: Joi.string().min(3).max(255).required(),
  email: Joi.string().min(4).max(1024).required().email(),
  phone: Joi.string().min(6).max(255),
  office: Joi.string().min(1).max(1024).required(),
  gender: Joi.string().required(),
  consultation: Joi.array().items(Joi.string()),
  instituteId: Joi.string().required(),
});

const schemas = {
  user,
  category,
  institute,
  employee,
};

const schemaValidation = (type) => (req, res, next) => {
  try {
    const schema = schemas[type];
    if (!schema) throw new Error("This type dont exists");
    const { error } = schema.validate(req.body);
    if (error) throw error;
    next();
  } catch (error) {
    res.status(BAD_REQUEST).send(error);
  }
};

module.exports = schemaValidation;
