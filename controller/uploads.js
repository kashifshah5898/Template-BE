const asyncHandler = require("express-async-handler");
const fs = require("fs");
const { deleteFile } = require("../utils/utils");

// upload picture and save it here at backend
const uploadPicture = asyncHandler(async (req, res) => {
  let file = req.files.picture;
  filename = new Date().getTime() + "$" + file.name;
  let filePath = "./assets/" + filename;

  //   is file with the same name is already uploaded
  if (fs.existsSync(filePath)) {
    res.status(200).json({
      success: false,
      msg: "Picture with same name is already uploaded",
      fileName: filename,
    });
  }

  fs.writeFileSync(filePath, file.data, "binary");
  res.status(200).json({
    success: true,
    msg: "Picture uploaded successfully",
    fileName: filename,
  });
});

const deletePicture = asyncHandler(async (req, res) => {
  const { fileName } = req.query;
  const deletingPicture = await deleteFile(fileName);
  if (deletingPicture) {
    res
      .status(200)
      .json({ success: true, msg: "Picture deleted successfully" });
  }
  res.status(200).json({
    success: false,
    msg: "Picture you are trying to delete is not available",
  });
});

module.exports = { uploadPicture, deletePicture };
