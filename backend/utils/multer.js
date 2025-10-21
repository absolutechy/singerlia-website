const multer = require("multer");

const upload = multer({
  dest: "temp_uploads/",
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file) return cb(null, true);

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/tiff",
      "image/svg+xml",
      "image/x-icon",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only PDF, ZIP, image, Excel, PowerPoint, or video files are allowed"
        )
      );
    }

    cb(null, true);
  },
});

module.exports = upload;
