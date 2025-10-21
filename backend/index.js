require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

const app = express();
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(
  cors({
    origin: process.env.LOCAL_CORS_ORIGIN,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));

const authRouter = require("./routers/authRouter");

app.use("/auth", authRouter);

app.get("/health", (req, res) => {
  const healthInfo = {
    status: "ok",
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(healthInfo);
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
