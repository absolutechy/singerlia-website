const { userIfAlreadyExists } = require("../services/users");
const { verifyJWT } = require("../utils/tokenUtils");

const Authenticator = async (req, res, next) => {
  try {
    const auth = req.headers["authorization"];
    const token =
      auth && auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const { userId } = verifyJWT(token);
    if (!userId) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const user = await userIfAlreadyExists(null, userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.token || user.token !== token) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { Authenticator };
