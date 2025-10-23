const express = require("express");
const {
  registerUser,
  verifyUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { Authenticator } = require("../middleWare/Authenticator");
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-user", verifyUser);
router.post("/login", loginUser);
router.get("/check-auth", Authenticator, getUserProfile);

module.exports = router;
