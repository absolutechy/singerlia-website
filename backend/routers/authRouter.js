const express = require("express");
const {
  registerUser,
  verifyUser,
  loginUser,
  getUserProfile,
  logoutUser,
} = require("../controllers/authController");
const { Authenticator } = require("../middleWare/Authenticator");
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-user", verifyUser);
router.post("/login", loginUser);
router.delete("/logout", Authenticator, logoutUser);
router.get("/check-auth", Authenticator, getUserProfile);

module.exports = router;
