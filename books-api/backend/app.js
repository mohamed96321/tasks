// =====================CONFIG PACKAGES===================== //
const path = require("path");
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
// const cors = require("cors");
const bodyParser = require("body-parser");
// =====================CONFIG PACKAGES===================== //

// =====================IMPORT CUSTOM MODULES===================== //
const connectToDatabase = require("../backend/config/database");
const mountRoutes = require("../backend/routes");
const ApiError = require("../backend/utils/apiError");
const globalError = require("../backend/middlewares/errorMiddleware");
// =====================IMPORT CUSTOM MODULES===================== //

// =====================USE DOTENV TO CONFIG DIFFERENT ENVIRONMENT VARIABLES===================== //
// require("dotenv").config({ path: "./.env" });
// =====================USE DOTENV TO CONFIG DIFFERENT ENVIRONMENT VARIABLES===================== //

// =====================CREATE AN EXPRESS APPLICATION===================== //
const app = express();
// =====================CREATE AN EXPRESS APPLICATION===================== //

// =====================DATABASE CONNECTION===================== //
connectToDatabase();
// =====================DATABASE CONNECTION===================== //

// =====================PARSES THE JSON PAYLOAD OF INCOMING REQUESTS===================== //
app.use(bodyParser.json({ limit: "20kb" }));
app.use(bodyParser.urlencoded({ extended: true }));
// =====================PARSES THE JSON PAYLOAD OF INCOMING REQUESTS===================== //

// =====================GET REQUESTS OF A FILENAME PATH THAT LOCATED IN UPLOADS FOLDER===================== //
app.use("backend/uploads", express.static(path.join("backend", "uploads")));
// =====================GET REQUESTS OF A FILENAME PATH THAT LOCATED IN UPLOADS FOLDER===================== //

// =====================MIDDLEWARES FOR MORGAN===================== //
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
  console.log("Development Mode!");
}

// =====================CORS FOR CROSS ORIGIN RESOURCE SHARING / CROSS SERVER COMMUNICATION===================== //
// app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    // "VALIDATE, OPTIONS, GET, POST, PUT, DELETE, UPDATE, HEAD, OPTIONS, CONNECT, PATCH, TRACE, DELETE, TRACE",
  );
  next();
});
// ====================CORS FOR CROSS ORIGIN RESOURCE SHARING / CROSS SERVER COMMUNICATION===================== //

// ====================MOUNT ROUTES===================== //
mountRoutes(app);
// ====================MOUNT ROUTES===================== //

// ====================ERROR MIDDLEWARE TO UNLINK FILES IF CREDENTIALS NOT CORRECT===================== //
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, () => {
      console.log("You must fill out all inputs with correct values.");
    });
  }
});
// ====================ERROR MIDDLEWARE TO UNLINK FILES IF CREDENTIALS NOT CORRECT===================== //

// ====================MIDDLEWARES FOR ANY NOT ESXITS ROUTES===================== //
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});
// ====================MIDDLEWARES FOR ANY NOT ESXITS ROUTES===================== //

// ====================GLOBAL ERROR HANDLING MIDDLEWARES FOR EXPRESS===================== //
app.use(globalError);
// ====================GLOBAL ERROR HANDLING MIDDLEWARES FOR EXPRESS===================== //

module.exports = app;
