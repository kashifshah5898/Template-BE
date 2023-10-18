const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const Redis = require("ioredis");
const constant = require("./constant");

const redis = new Redis();

const accessToken = (payLoad) => {
  const newAccessToken = jwt.sign({ id: payLoad }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: constant.ACCESS_TOKEN_EXPIRY,
  });
  return newAccessToken;
};

const refreshToken = (payLoad) => {
  const refreshToken = jwt.sign({ id: payLoad }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: constant.REFRESH_TOKEN_EXPIRY,
  });

  return refreshToken;
};

const encodedData = (payLoad, statusCode, isError) => {
  const ciphertext = CryptoJS.AES.encrypt(
    isError ? JSON.stringify(payLoad) : payLoad,
    process.env.CRYPTO_SECRET
  ).toString();

  let res =
    process.env.NODE_ENV === "Development"
      ? {
          code: statusCode,
          rawData: isError ? payLoad : JSON.parse(payLoad),
          encodedData: ciphertext,
        }
      : { code: statusCode, encodedData: ciphertext };

  return JSON.stringify(res);
};

const decodeData = (encodeData) => {
  let bytes = CryptoJS.AES.decrypt(encodeData, process.env.CRYPTO_SECRET);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);

  console.log("My Text", originalText);
};

const settingValueToRedis = (key, value) => {
  redis.set(key, JSON.stringify(value));
};

const gettingValueFromRedis = async (key) => {
  let recievedData;
  await redis.get(key, (err, data) => {
    if (err) {
      return console.log("ERROR: ", err);
    }
    recievedData = JSON.parse(data);
  });

  return recievedData;
};

module.exports = {
  accessToken,
  refreshToken,
  encodedData,
  decodeData,
  settingValueToRedis,
  gettingValueFromRedis,
};
