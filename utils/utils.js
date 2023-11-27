const jwt = require("jsonwebtoken");
const constant = require("./constant");

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

module.exports = {
  accessToken,
};
