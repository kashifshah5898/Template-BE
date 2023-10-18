const CryptoJS = require("crypto-js");
const { encodedData, decodeData } = require("../utils/utils");

const encodeData = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    originalSend.call(this, encodedData(data, res.statusCode, false));
  };

  next();
};

module.exports = encodeData;
