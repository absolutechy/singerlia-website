const crypto = require("crypto");

function generateSecureOTP(length = 6) {
  const digits =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let otp = "";
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    otp += digits[randomBytes[i] % digits.length];
  }

  return {
    otp,
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
}

module.exports = { generateSecureOTP };
