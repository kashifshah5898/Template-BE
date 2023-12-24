const jwt = require("jsonwebtoken");
const constant = require("./constant");
const asyncHandler = require("express-async-handler")
const fs = require("fs");

const accessToken = (payLoad) => {
  const newAccessToken = jwt.sign(
    { id: payLoad },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: constant.ACCESS_TOKEN_EXPIRY,
    }
  );
  return newAccessToken;
};


const deleteFile = asyncHandler(async (fileName) => {
  // if file is default picture
  if (fileName == "global.png") {
    return true;
  }

  //   is file with the same name is present or not
  let path = "./assets/" + fileName;

  if (fs.existsSync(path)) {
    // delete file
    fs.unlinkSync(path);
    return true;
  }

  //   file with the provided path is not present
  return false;
});


module.exports = {
  accessToken,
  deleteFile
};
