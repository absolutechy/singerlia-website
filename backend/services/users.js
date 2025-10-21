require("dotenv").config();
const s3Service = require("../utils/s3Utils");

const BUCKET = process.env.BUCKET_NAME;
const USERS = process.env.USERS;

const getAllUsers = async () => {
  try {
    const users = await s3Service.getS3JsonObject(BUCKET, USERS);
    if (!users) {
      return [];
    } else {
      return users;
    }
  } catch (error) {
    if (error.name === "NoSuchKey") {
      return [];
    }
    throw error;
  }
};

const userIfAlreadyExists = async (phonenumber, userId) => {
  const users = await getAllUsers();
  return users.find(
    (user) => user.phonenumber === phonenumber || user.userId === userId
  );
};

const saveUser = async (newUser) => {
  try {
    const users = await getAllUsers();
    users.push(newUser);
    await s3Service.putS3JsonObject(BUCKET, USERS, users);
    return newUser;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (updatedUser) => {
  try {
    const users = await getAllUsers();
    const index = users.findIndex((user) => user.userId === updatedUser.userId);
    if (index === -1) {
      throw new Error("User not found");
    }
    users[index] = updatedUser;
    await s3Service.putS3JsonObject(BUCKET, USERS, users);
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsers,
  saveUser,
  userIfAlreadyExists,
  updateUser,
};
