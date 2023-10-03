const multer = require('multer');

function createMulterStorage(uploadPath) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const [, ext] = file.originalname.split('.');
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
    },
  });

  return storage;
}

module.exports = {
  createMulterStorage,
};
