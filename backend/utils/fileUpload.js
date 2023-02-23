const multer = require("multer");

// Define File Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname)     // 23-07-2020
    }
  })


// Specify file format that can be saved
function fileFilter (req, file, cb) {
  if(
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" 
  ) {
      cb(null, true)
  } else {
      cb(null, false)
  }
}

const upload = multer({ storage, fileFilter})

// File Size Formatter
function formatFileSize(bytes,decimalPoint) {
  if(bytes == 0) return '0 Bytes';
 
  var k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


module.exports = {upload, formatFileSize}