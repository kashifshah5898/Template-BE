const asyncHandler = require("express-async-handler");
const Album = require("../models/albumModel")

const getAlbums = asyncHandler(async (req, res) => {
  const { id, artist } = req.query;

  if (id) {
    const album = await Album.findById(id);
    res.status(200).json({ success: true, data: album });
    return;
  }

  if (artist) {
    const album = await Album.find({ artist: artist }).populate('artist');
    res.status(200).json({ success: true, data: album });
    return;
  }

  const albums = await Album.find().populate('artist');;
  res.status(200).json({ success: true, data: albums });
});

const getAlbumsByGenre = asyncHandler(async (req, res) => {
  const { genre } = req.query;

  if (!genre) {
    res.status(400);
    throw new Error('Genre not found')
  }

  const albums = await Album.find({ genre: genre }).populate('artist');;

  res.status(200).json({ success: true, data: albums });
});

const addAlbum = asyncHandler(async (req, res) => {
  const { title, cover_small, link, artist, duration, genre } = req.body;

  if (!title || !cover_small || !link || !artist || !genre) {
    res.status(400);
    throw new Error("Please Fill all required fields");
  }



  const newAlbum = await Album.create({ title, cover_small, link, artist, duration, genre });

  res.status(200).json({ success: true, msg: "Album added successfully" });
});

const updateAlbum = asyncHandler(async (req, res) => {
  const { id } = req.query
  const { title, cover_small, link, artist, duration } = req.body;

  if (!title || !cover_small || !link || !artist) {
    res.status(400);
    throw new Error("Please Fill all required fields");
  }

  const newAlbum = await Album.findByIdAndUpdate(id, { title, cover_small, link, artist, duration });

  res.status(200).json({ success: true, msg: "Album updated successfully" });
});

const removeAlbum = asyncHandler(async (req, res) => {
  const { id } = req.query

  if (!id) {
    res.status(400);
    throw new Error("Please Fill all required fields");
  }

  await Album.findByIdAndDelete(id);

  res.status(200).json({ success: true, msg: "Album Deleted successfully" });
});

module.exports = { getAlbums, getAlbumsByGenre, addAlbum, updateAlbum, removeAlbum };
