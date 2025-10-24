const express = require("express");
const {
  registerUser,
  verifyUser,
  loginUser,
  getUserProfile,
  logoutUser,
  resetPassword,
  sendResetPasswordCode,
  resetForgottenPassword,
  resendOTP,
} = require("../controllers/authController");
const { Authenticator } = require("../middleWare/Authenticator");
const router = express.Router();

router.post("/register", registerUser);
router.post("/resend-otp", resendOTP);
router.post("/verify-user", verifyUser);
router.post("/login", loginUser);
router.delete("/logout", Authenticator, logoutUser);
router.get("/check-auth", Authenticator, getUserProfile);
router.post("/send-reset-password-code", sendResetPasswordCode);
router.post("/reset-forgotten-password", resetForgottenPassword);
router.post("/reset-password", Authenticator, resetPassword);

module.exports = router;
