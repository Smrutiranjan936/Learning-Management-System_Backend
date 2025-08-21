const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'profiles/'); // folder to save
  },
  filename: (req, file, cb) => {
    // Generate unique filename with extension only
    const ext = path.extname(file.originalname); // get file extension (.jpg, .png)
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const uploadProfile = multer({ storage: storage });
module.exports = uploadProfile;
