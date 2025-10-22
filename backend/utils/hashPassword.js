require("dotenv").config();
const bcrypt = require("bcrypt");

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const PEPPER = process.env.PASSWORD_PEPPER;

async function hashPassword(userId, password) {
  if (!userId || !password) {
    throw new Error("userId and password are required");
  }

  const input = `${password}:${userId}${PEPPER}`;

  const hashed = await bcrypt.hash(input, SALT_ROUNDS);
  return hashed;
}

async function verifyPassword(userId, password, storedHash) {
  if (!userId || !password || !storedHash) {
    return false;
  }
  const input = `${password}:${userId}${PEPPER}`;
  return await bcrypt.compare(input, storedHash);
}

module.exports = { hashPassword, verifyPassword };
