const express = require("express");
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  login,
} = require("../controller/userController");
const { protect } = require("../middleWare/authMiddleware");
const route = express.Router();

route.get("/", protect, getUsers);
route.post("/add-user", addUser);
route.post("/login", login);
route.put("/update-user", updateUser);
route.delete("/remove-user", deleteUser);

module.exports = route;
