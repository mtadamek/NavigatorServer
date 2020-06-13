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

/**
 * @swagger
 * /api/institutes:
 *   get:
 *     description: Pobieranie wszystkich instytutów.
 *     responses:
 *       200:
 *         description: Pomyślne pobranie instytutów.
 *       400:
 *         description: Nieprawidłowe zapytanie.
 *       500:
 *         description: Problem z serwerem.
 */
router.get("/", async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.status(OK).send(institutes);
  } catch (error) {
    res.status(BAD_REQUEST).send(error);
  }
});

/**
 * @swagger
 * /api/institutes:
 *   post:
 *     description: Stworzenie nowego instytutu.
 *     security:              
 *       - JWT: [] 
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: name
 *         type: string
 *         description: Nazwa instytutu.
 *       - in: formData
 *         name: address
 *         type: string
 *         description: Adres instytutu.
 *       - in: formData
 *         name: phone
 *         type: string
 *         description: Numer telefonu do sekreteriatu.
 *       - in: formData
 *         name: email
 *         type: string
 *         description: Email do instytutu.
 *       - in: formData
 *         name: office
 *         type: string
 *         description: Numer pokoju sekreteriatu.
 *       - in: formData
 *         name: image
 *         type: file
 *         description: Logo instytutu.
 *     responses:
 *       201:
 *         description: Pomyślne stworzenie instytutu.
 *       400:
 *         description: Nieprawidłowe zapytanie.
 *       500:
 *         description: Problem z serwerem.
 */
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
