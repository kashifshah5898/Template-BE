const express = require("express");
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  login,
  updateUserPassword,
} = require("../controller/userController");
const { protect } = require("../middleWare/authMiddleware");
const route = express.Router();

route.get("/", protect, getUsers);
route.put("/update-user-password", protect, updateUserPassword);
route.post("/add-user", addUser);
route.post("/login", login);
route.put("/update-user", protect, updateUser);
route.delete("/remove-user", protect, deleteUser);

module.exports = route;
