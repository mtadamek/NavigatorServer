const express = require("express");
const router = express.Router();

const Employee = require("../models/Employee");
const schema = require("../middlewares/schema");
const auth = require("../middlewares/auth");
const upload = require("../utils/uploadImage");
const { EMPLOYEE } = require("../constants/validationTypes");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("../constants/httpStatusCodes");

/**
 * @swagger
 * /api/employees:
 *   get:
 *     description: Pobieranie wszystkich pracowników lub tylko z danego instytutu.
 *     parameters:
 *       - in: query
 *         name: instituteId
 *         type: string
 *         description: Identyfikator instytutu.
 *     responses:
 *       200:
 *         description: Pomyślne pobranie pracowników.
 *       400:
 *         description: Nieprawidłowe zapytanie.
 *       500:
 *         description: Problem z serwerem.
 */
router.get("/", async (req, res) => {
  try {
    const { instituteId } = req.query;
    const employees = instituteId
      ? await Employee.find({ instituteId })
      : await Employee.find();
    res.status(OK).send(employees);
  } catch (error) {
    res.status(BAD_REQUEST).send(error);
  }
});

/**
 * @swagger
 * /api/employees:
 *   post:
 *     description: Dodanie nowego pracownika.
 *     security:
 *       - JWT: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: forename
 *         type: string
 *         description: Imię pracownika.
 *       - in: formData
 *         name: surname
 *         type: string
 *         description: Nazwisko pracownika.
 *       - in: formData
 *         name: degree
 *         type: string
 *         description: Stopień naukowy.
 *       - in: formData
 *         name: gender
 *         type: string
 *         description: Płeć.
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
 *         name: consultation
 *         type: string
 *         description: Informacje o konsultacji.
 *       - in: formData
 *         name: image
 *         type: file
 *         description: Zdjęcie pracownika.
 *       - in: formData
 *         name: instituteId
 *         type: integer
 *         description: Idetntyfikator instytutu.
 *     responses:
 *       201:
 *         description: Pomyślne stworzenie pracownika.
 *       400:
 *         description: Nieprawidłowe zapytanie.
 *       500:
 *         description: Problem z serwerem.
 */
router.post(
  "/",
  auth,
  upload.single("image"),
  schema(EMPLOYEE),
  async (req, res) => {
    try {
      //Check file has been loaded
      //if (!req.file) throw "Image don't exist";
      const {
        forename,
        surname,
        gender,
        degree,
        email,
        phone,
        office,
        consultation,
        instituteId,
      } = req.body;
      //Check employee exist in DB
      const employee = await Employee.findOne({ forename, surname });
      if (employee) throw "Employee arleady exist!";
      //Create new employee object
      const newEmployee = new Employee({
        forename,
        surname,
        gender,
        degree,
        email,
        phone,
        office,
        consultation,
        instituteId,
        image: req.file
          ? req.file.filename
          : gender === "male"
          ? "man.png"
          : "woman.png",
      });
      //Save new category to DB
      const savedEmployee = await newEmployee.save();
      res.status(CREATED).send(savedEmployee);
    } catch (error) {
      res.status(BAD_REQUEST).send(error);
    }
  }
);

module.exports = router;
