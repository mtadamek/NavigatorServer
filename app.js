const express = require("express");
const app = express();
const helmet = require("helmet");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//.ENV
dotenv.config();

const HOST_IP = process.env.HOST_IP;
const PORT = process.env.PORT || 4444;

//Swagger UI
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Navigator API",
      description: "PK WM Navigator API information",
      version: "0.1",
      contact: {
        name: "Politechnika Krakowska Wydział Mechaniczny",
      },
    },
    host: `${HOST_IP}:${PORT}`,
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        description: "Autoryzacja za pomocą JWT",
        name: "auth-token",
        in: "header",
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

//Middlewares
app.use(helmet());
app.use(express.static("public"));
app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//MongoDB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw ("DB error:", err);
    console.log("Connected to DB!");
  }
);

//Routes
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/categories");
const instituteRoutes = require("./routes/institutes");
const employeeRoutes = require("./routes/employees");

//Route Middlewares
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/institutes", instituteRoutes);
app.use("/api/employees", employeeRoutes);

app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});
