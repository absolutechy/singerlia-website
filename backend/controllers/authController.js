require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { generateSecureOTP } = require("../utils/otpGenerator");
const {
  saveUser,
  userIfAlreadyExists,
  updateUser,
} = require("../services/users");

const registerUser = async (req, res) => {
  try {
    const { role } = req.query;
    if (!role)
      return res
        .status(400)
        .json({ message: "Role query parameter is required" });

    if (["user", "singer"].indexOf(decodeURIComponent(role)) === -1) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const {
      first_name,
      last_name,
      phonenumber,
      email,
      gender,
      intro_vid_link,
      city,
      address,
      password,
    } = req.body;
    if (!first_name || !last_name || !phonenumber || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const userExists = await userIfAlreadyExists(phonenumber);
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const userId = uuidv4();
    const timestamp = new Date().toISOString();
    const decodedRole = role ? decodeURIComponent(role) : "user";
    const { otp, expiresAt } = generateSecureOTP();

    const newUser = {
      userId,
      name: `${first_name} ${last_name}`,
      phonenumber,
      email: email || null,
      gender: gender || null,
      intro_vid_link: intro_vid_link || null,
      city: city || null,
      address: address || null,
      password,
      role: decodedRole,
      token: null,
      createdAt: timestamp,
      isVerified: false,
      otp: otp,
      otpExpiresAt: expiresAt,
    };

    const savedUser = await saveUser(newUser);
    if (!savedUser) {
      return res.status(500).json({ message: "Failed to register user" });
    }

    res.status(201).json({
      message: "User registered successfully",
      userId: savedUser.userId,
      otp: savedUser.otp,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await userIfAlreadyExists(null, userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const currentTime = new Date();
    const otpExpiryTime = new Date(user.otpExpiresAt);
    if (currentTime > otpExpiryTime) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;

    const updatedUser = await updateUser(user);

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to verify user" });
    }

    res.status(200).json({
      message: "User verified successfully",
      userId: updatedUser.userId,
    });
  } catch (error) {
    console.error("Error in verifyUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  verifyUser,
};
