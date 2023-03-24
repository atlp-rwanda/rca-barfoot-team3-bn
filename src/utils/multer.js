const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '/tmp/');
  },
  filename(req, file, cb) {
    cb(null, `${new Date().toISOString()} - ${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb({ message: 'Unsupported file' }, false);
    }
  }
});

module.exports = upload;
