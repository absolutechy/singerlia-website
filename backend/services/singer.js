require("dotenv").config();
const s3Service = require("../utils/s3Utils");

const BUCKET = process.env.BUCKET_NAME;
const USERS = process.env.USERS;

const getAllSingers = async () => {
  try {
    const users = await s3Service.getS3JsonObject(BUCKET, USERS);
    if (!users) {
      return {};
    } else {
      const singers = Object.values(users)
        .filter((user) => user.role === "singer")
        .map((user) => ({
          userId: user.userId,
          name: user.name,
          phonenumber: user.phonenumber,
          email: user.email,
          genre: user.genre,
          intro_vid_link: user.intro_vid_link,
          city: user.city,
          address: user.address,
          joinedAt: user.createdAt,
          isVerified: true,
        }));
      return singers;
    }
  } catch (error) {
    if (error.name === "NoSuchKey") {
      return {};
    }
    throw error;
  }
};

const getSingerById = async (id) => {
  try {
    const users = await s3Service.getS3JsonObject(BUCKET, USERS);
    if (!users) {
      return {};
    } else {
      const singer = users[id];
      if (singer && singer.role === "singer") {
        return {
            userId: singer.userId,
            name: singer.name,
            phonenumber: singer.phonenumber,
            email: singer.email,
            genre: singer.genre,
            intro_vid_link: singer.intro_vid_link,
            city: singer.city,
            address: singer.address,
            joinedAt: singer.createdAt,
            isVerified: true,
        };
      } else {
        return null;
      }
    }
  } catch (error) {
    if (error.name === "NoSuchKey") {
      return {};
    }
    throw error;
  }
};

module.exports = {
  getAllSingers,
  getSingerById,
};
