const express = require("express");
const multer = require("multer");
const { updateProfileImage } = require("../controllers/users");
const { createMulterStorage } = require("../utils/createMulterStorage");

const upload = multer({
  storage: createMulterStorage("src/public/images/users"),
});

const router = express.Router();

router.put("/profile-image", upload.single("profileImage"), updateProfileImage);

module.exports = router;
