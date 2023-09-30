const express = require('express');
const multer = require('multer');
const { updateProfileImage } = require('../controllers/users');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/images');
  },
  filename: function (req, file, cb) {
    const [, ext] = file.originalname.split('.');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.put('/profile-image', upload.single('profileImage'), updateProfileImage);

module.exports = router;
