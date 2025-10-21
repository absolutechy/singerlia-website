const express = require("express");
const { registerUser, verifyUser } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-user", verifyUser);

module.exports = router;
