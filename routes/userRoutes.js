const express = require("express");
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  login,
  updateUserToken,
  logOut,
} = require("../controller/userController");
const { protect } = require("../middleWare/authMiddleware");
const route = express.Router();

route.get("/", protect, getUsers);
route.post("/add-user", addUser);
route.post("/login", login);
route.put("/update-user", updateUser);
route.delete("/remove-user", deleteUser);
route.post("/update-token", protect, updateUserToken);
route.post("/logout", protect, logOut);

module.exports = route;
