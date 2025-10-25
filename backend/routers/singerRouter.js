const express = require("express");
const { Authenticator } = require("../middleWare/Authenticator");
const {
  getAllSingersHandler,
  getSingerByIdHandler,
} = require("../controllers/singerController");
const router = express.Router();

router.get("/", getAllSingersHandler);
router.get("/:id", getSingerByIdHandler);

module.exports = router;
