const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { accessToken } = require("../utils/utils");
const constant = require("../utils/constant");

const getUsers = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (id) {
    const myProfile = await User.findById(id).select("-password");
    res.status(200).json({ success: true, data: myProfile });
    return;
  }

  const allUsers = await User.find().select("-password");
  res.status(200).json({ success: true, data: allUsers });
});

const getArtist = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (id) {
    const myProfile = await User.findById(id).select("-password");
    res.status(200).json({ success: true, data: myProfile });
    return;
  }

  const allUsers = await User.find({ role: "artist" }).select("-password");
  res.status(200).json({ success: true, data: allUsers });
});

const addUser = asyncHandler(async (req, res) => {
  const { name, email, password, dob } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Fill all required fields");
  }

  const isEmail = await User.findOne({ email: email });
  if (isEmail) {
    res.status(400);
    throw new Error(`Email already exist`);
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name: name,
    email: email,
    password: hashPassword,
    dob: dob,
    role: "user",
    profilePicture: "global.png",
    followMe: [],
    iFollow: [],
    likedSongs: []
  });

  res.status(200).json({ success: true, msg: "User created successfully" });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.query;
  const { name, email, dob, role, profilePicture, followMe, iFollow } =
    req.body;
  if (!id) {
    res.status(400);
    throw new Error(constant.REQUIRED_FIELD_TEXT);
  }

  const isUser = await User.findById(id);
  if (!isUser) {
    res.status(400);
    throw new Error(`User not found`);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      name: name || isUser.name,
      email: email || isUser.email,
      dob: dob || isUser.dob,
      role: role || isUser.role,
      profilePicture: profilePicture || "global.png",
      followMe: followMe || isUser?.followMe || [],
      iFollow: iFollow || isUser?.iFollow || [],
    },
    { new: true }
  );

  const userUpdated = {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    dob: updatedUser.dob,
    role: updatedUser.role,
    profilePicture: updatedUser.profilePicture,
    followMe: updatedUser.followMe,
    iFollow: updatedUser.iFollow,
  };

  res.status(200).json({
    success: true,
    data: userUpdated,
    msg: "User updated successfully",
  });
});

const disLikeSong = asyncHandler(async (req, res) => {
  const { songId, disLikedBy } = req.body

  if (!songId || !disLikedBy) {
    res.status(400);
    throw new Error(constant.REQUIRED_FIELD_TEXT);
  }

  const isUser = await User.findById(disLikedBy);
  if (!isUser) {
    res.status(400);
    throw new Error(`User not found`);
  }

  let allLikedSongs = isUser?.likedSongs ? isUser?.likedSongs : [];
  let songIndex = allLikedSongs.indexOf(songId);

  if (songIndex !== -1) {
    allLikedSongs.splice(songIndex, 1)
  }


  const updatedUser = await User.findByIdAndUpdate(
    disLikedBy,
    {
      likedSongs: allLikedSongs,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updatedUser,
    msg: "Song Disliked successfully",
  });
});

const likeSong = asyncHandler(async (req, res) => {
  const { songId, likedBy } = req.body

  if (!songId || !likedBy) {
    res.status(400);
    throw new Error(constant.REQUIRED_FIELD_TEXT);
  }

  const isUser = await User.findById(likedBy);
  if (!isUser) {
    res.status(400);
    throw new Error(`User not found`);
  }

  let allLikedSongs = isUser?.likedSongs ? isUser?.likedSongs : [];
  allLikedSongs.push(songId)

  const updatedUser = await User.findByIdAndUpdate(
    likedBy,
    {
      likedSongs: allLikedSongs,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updatedUser,
    msg: "Song Liked successfully",
  });
});

const followArtist = asyncHandler(async (req, res) => {
  const { artistId, userId } = req.body

  if (!artistId || !userId) {
    res.status(400);
    throw new Error(constant.REQUIRED_FIELD_TEXT);
  }

  const isUser = await User.findById(userId);
  if (!isUser) {
    res.status(400);
    throw new Error(`User not found`);
  }

  const isArtist = await User.findById(artistId);
  if (!isArtist) {
    res.status(400);
    throw new Error(`Artist not found`);
  }

  let allIFollowedArtist = isUser?.iFollow ? isUser?.iFollow : [];
  allIFollowedArtist.push(artistId)

  let followedArtist = isUser?.followMe ? isUser?.followMe : [];
  followedArtist.push(userId)

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      iFollow: allIFollowedArtist
    },
    { new: true }
  );

  const updatedArtist = await User.findByIdAndUpdate(
    artistId,
    {
      followMe: followedArtist
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updatedUser,
    updatedArtist: updatedArtist,
    msg: "Artist Followed successfully",
  });
});

const unFollowArtist = asyncHandler(async (req, res) => {
  const { artistId, userId } = req.body

  if (!artistId || !userId) {
    res.status(400);
    throw new Error(constant.REQUIRED_FIELD_TEXT);
  }

  const isUser = await User.findById(userId);
  if (!isUser) {
    res.status(400);
    throw new Error(`User not found`);
  }

  const isArtist = await User.findById(artistId);
  if (!isArtist) {
    res.status(400);
    throw new Error(`Artist not found`);
  }

  let allIFollowedArtist = isUser?.iFollow ? isUser?.iFollow : [];
  let iFollowIndex = allIFollowedArtist.indexOf(artistId);

  if (iFollowIndex !== -1) {
    allIFollowedArtist.splice(iFollowIndex, 1);
  }

  let followedArtist = isUser?.followMe ? isUser?.followMe : [];
  let followMeIndex = followedArtist.indexOf(userId);

  if (followMeIndex !== -1) {
    followedArtist.splice(followMeIndex, 1);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      iFollow: allIFollowedArtist
    },
    { new: true }
  );

  const updatedArtist = await User.findByIdAndUpdate(
    artistId,
    {
      followMe: followedArtist
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updatedUser,
    updatedArtist: updatedArtist,
    msg: "Artist Un-Followed successfully",
  });
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Fill all required fields");
  }

  const findUser = await User.findById(userId);
  const isTrue = await bcrypt.compare(oldPassword, findUser.password);

  if (!isTrue) {
    res.status(400);
    throw new Error("Old password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updateUser = await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });

  res.status(200).json({ success: true, msg: "Password updated successfully" });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400);
    throw new Error(constant.REQUIRED_FIELD_TEXT);
  }

  await User.findByIdAndDelete(id);
  res.status(200).json({ success: true, msg: "User deleted successfully" });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error(constant.REQUIRED_FIELD_TEXT);
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(400);
    throw new Error("Invalid email address");
  }

  if (email && (await bcrypt.compare(password, user.password))) {
    const payLoad = {
      _id: user._id,
      name: user.name,
      email: user.email,
      dob: user.dob,
      role: user.role,
      profilePicture: user.profilePicture,
      followMe: user.followMe,
      iFollow: user.iFollow,
      likedSongs: user?.likedSongs || [],
      accessToken: accessToken(user._id),
    };
    res
      .status(200)
      .json({ success: true, data: payLoad, msg: "Login Successfull" });
  } else {
    res.status(400);
    throw new Error("Inavlid email or password");
  }
});

module.exports = {
  getUsers,
  getArtist,
  addUser,
  updateUser,
  likeSong,
  followArtist,
  unFollowArtist,
  disLikeSong,
  deleteUser,
  login,
  updateUserPassword,
};
