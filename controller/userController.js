const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  accessToken,
  refreshToken,
  gettingValueFromRedis,
  settingValueToRedis,
} = require("../utils/utils");
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

const addUser = asyncHandler(async (req, res) => {
  const { name, email, password, dob } = req.body;

  if (!name || !email || !password || !dob) {
    res.status(400);
    throw new Error(constant.REQUIRED_FIELD_TEXT);
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
  });

  res.status(200).json({ success: true, msg: "User created successfully" });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.query;
  const { name, email, dob } = req.body;

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
    },
    { new: true }
  );

  const userUpdated = {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    dob: updatedUser.dob,
  };

  res.status(200).json({ success: true, data: userUpdated, msg: "User updated successfully" });
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
      tokens: {
        accessToken: accessToken(user._id),
        refreshToken: refreshToken(user._id),
      },
    };
    let allTokens = [];

    allTokens = await gettingValueFromRedis("refreshTokensList");

    if (allTokens == null) {
      allTokens = [];
    }
    allTokens.push(payLoad.tokens.refreshToken);
    settingValueToRedis("refreshTokensList", allTokens);
    res.status(200).json({ success: true, data: payLoad });
  } else {
    res.status(400);
    throw new Error("Inavlid email or password");
  }
});

const updateUserToken = asyncHandler(async (req, res) => {
  const { user } = req;

  const { refreshTokenFE } = req.body;

  if (!refreshTokenFE) {
    res.status(401);
    throw new Error("Please fill all required parameters");
  }

  let allTokens = [];

  allTokens = await gettingValueFromRedis("refreshTokensList");

  if (allTokens == null) {
    allTokens = [];
  }

  if (allTokens.length && !allTokens.includes(refreshTokenFE)) {
    res.status(401);
    throw new Error("Not authorized, Invalid token");
  }

  const comparingTokenInRedis = allTokens.findIndex((token, index) => {
    return token === refreshTokenFE;
  });

  // Check if the token was found
  if (comparingTokenInRedis !== -1) {
    const updatedToken = refreshToken(user._id);
    allTokens[comparingTokenInRedis] = updatedToken;
    settingValueToRedis("refreshTokensList", allTokens);

    const payLoad = {
      _id: user._id,
      name: user.name,
      email: user.email,
      dob: user.dob,
      tokens: {
        accessToken: accessToken(user._id),
        refreshToken: updatedToken,
      },
    };

    res.status(200).json({ success: true, data: payLoad });
  } else {
    res.status(401);
    throw new Error("Not authorized, Invalid token");
  }
});

const logOut = asyncHandler(async (req, res) => {
  const { refreshTokenFE } = req.body;

  if (!refreshTokenFE) {
    res.status(401);
    throw new Error(constant.REQUIRED_FIELD_TEXT);
  }

  let allTokens = [];

  allTokens = await gettingValueFromRedis("refreshTokensList");

  if (allTokens == null) {
    allTokens = [];
  }

  if (allTokens.length && !allTokens.includes(refreshTokenFE)) {
    res.status(401);
    throw new Error("Not authorized, Invalid token");
  }

  const comparingTokenInRedis = allTokens.findIndex((token, index) => {
    return token === refreshTokenFE;
  });

  // Check if the token was found
  if (comparingTokenInRedis !== -1) {
    allTokens.splice(comparingTokenInRedis, 1);
    settingValueToRedis("refreshTokensList", allTokens);

    res.status(200).json({ success: true, msg: "User logout successfully" });
  } else {
    res.status(401);
    throw new Error("Not authorized, Invalid token");
  }
});

module.exports = { getUsers, addUser, updateUser, deleteUser, login, updateUserToken, logOut };
