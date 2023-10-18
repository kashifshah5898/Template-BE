module.exports = {
  ENVIORMENT: process.env.NODE_ENV,
  PORT: process.env.PORT || 8000,
  CRYPTO_SECRET: process.env.CRYPTO_SECRET,
  ACCESS_TOKEN_EXPIRY: "15m",
  REFRESH_TOKEN_EXPIRY: "1h",
  REQUIRED_FIELD_TEXT: "Please Fill All Required Parameters",
};
