const express = require("express");
const router = express.Router();
const messageControl = require("./message.control");
const { body } = require("express-validator");
const authMiddleware = require("../user/user.middleware");
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure "uploads" folder exists
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed!"), false);
    }
  };
  
const upload = multer({ storage });

router.post(
  "/send",
  [
    authMiddleware.authUser,
    body("sentBy")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("Invalid sender ID"),
    body("room").isString().notEmpty().withMessage("Room ID is required"),
  ],
  upload.single("image"), 
  messageControl.sendMessage
);

router.get("/:roomId", authMiddleware.authUser, messageControl.getMessages);

router.post(
  "/delete-message",
  authMiddleware.authUser,
  body("id").isString().notEmpty().withMessage("Chat ID is required"),
  messageControl.deleteMessage
);

module.exports = router;
