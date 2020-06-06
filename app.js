const express = require("express");
const app = express();
const helmet = require("helmet");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//Middlewares
app.use(helmet());
app.use(express.static("public"));
app.use(express.json());

//.ENV
dotenv.config();

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

//Route Middlewares
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/institutes", instituteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});
