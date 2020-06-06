const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/files/"),
  filename: (req, file, cb) =>
    cb(null, new Date().toISOString() + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb("Unsupported file type.", false);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
  fileFilter,
});

module.exports = upload;
