require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { generateSecureOTP } = require("../utils/otpGenerator");
const {
  saveUser,
  userIfAlreadyExists,
  updateUser,
} = require("../services/users");
const { hashPassword, verifyPassword } = require("../utils/hashPassword");
const { generateToken } = require("../utils/tokenUtils");

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
    const hashedPassword = await hashPassword(userId, password);

    const newUser = {
      userId,
      name: `${first_name} ${last_name}`,
      phonenumber,
      email: email || null,
      gender: gender || null,
      intro_vid_link: intro_vid_link || null,
      city: city || null,
      address: address || null,
      password: hashedPassword,
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

const loginUser = async (req, res) => {
  try {
    const { phonenumber, password } = req.body;
    if (!phonenumber || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await userIfAlreadyExists(phonenumber);
    if (!user) {
      return res.status(404).json({ message: "Invalid phone number" });
    }

    const isPasswordValid = await verifyPassword(
      user.userId,
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your account" });
    }

    const token = generateToken(user.userId);
    user.token = token;

    const updatedUser = await updateUser(user);
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to login user" });
    }

    res.status(200).json({
      message: "User logged in successfully",
      token: updatedUser.token,
      user_metadata: {
        userId: updatedUser.userId,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const user = req.user;
    user.token = null;

    const updatedUser = await updateUser(user);
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to logout user" });
    }
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      userId: user.userId,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const user = req.user;
    const { previousPassword, newPassword } = req.body;

    if (!previousPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const isPasswordValid = await verifyPassword(
      user.userId,
      previousPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid previous password" });
    }

    const hashedNewPassword = await hashPassword(user.userId, newPassword);
    user.password = hashedNewPassword;
    const updatedUser = await updateUser(user);
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to reset password" });
    }
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendResetPasswordCode = async (req, res) => {
  try {
    const { phonenumber } = req.body;
    if (!phonenumber) {
      return res.status(400).json({ message: "Phone number required" });
    }
    const user = await userIfAlreadyExists(phonenumber);
    if (!user) {
      return res.status(404).json({ message: "Invalid phone number provided" });
    }
    const { otp, expiresAt } = generateSecureOTP();
    user.resetPasswordCode = otp;
    user.resetPasswordExpireAt = expiresAt;
    const updatedUser = await updateUser(user);
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to generate reset code" });
    }

    res.status(200).json({
      message: "Reset code generated successfully",
      userId: updatedUser.userId,
      resetPasswordCode: updatedUser.resetPasswordCode,
    });
  } catch (error) {
    console.error("Error in sendResetPasswordCode:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetForgottenPassword = async (req, res) => {
  try {
    const { userId, resetPasswordCode, newPassword } = req.body;
    if (!userId || !resetPasswordCode || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await userIfAlreadyExists(null, userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.resetPasswordCode !== resetPasswordCode) {
      return res.status(400).json({ message: "Invalid reset password code" });
    }
    const currentTime = new Date();
    const codeExpiryTime = new Date(user.resetPasswordExpireAt);
    if (currentTime > codeExpiryTime) {
      return res
        .status(400)
        .json({ message: "Reset password code has expired" });
    }
    const hashedNewPassword = await hashPassword(user.userId, newPassword);
    user.password = hashedNewPassword;
    user.resetPasswordCode = null;
    user.resetPasswordExpireAt = null;
    const updatedUser = await updateUser(user);
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to reset password" });
    }
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetForgottenPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  getUserProfile,
  logoutUser,
  resetPassword,
  sendResetPasswordCode,
  resetForgottenPassword,
};
