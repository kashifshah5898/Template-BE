const express = require("express");
const route = express.Router();
const { getAlbums, addAlbum, updateAlbum, removeAlbum, getAlbumsByGenre } = require("../controller/albumsController");
const { protect } = require("../middleWare/authMiddleware");

route.get("/", getAlbums);
route.get("/by-genre", getAlbumsByGenre);
route.post("/addAlbum", protect, addAlbum);
route.put("/updateAlbum", protect, updateAlbum);
route.delete("/removeAlbum", protect, removeAlbum);

module.exports = route;
