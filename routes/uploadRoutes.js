const express = require("express");
const routes = express.Router();
const { protect } = require("../middleWare/authMiddleware");
const { uploadPicture, deletePicture } = require("../controller/uploads");

routes.post("/picture", protect, uploadPicture);
routes.delete("/deletePicture", protect, deletePicture);

module.exports = routes;
