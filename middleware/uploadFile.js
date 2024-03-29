const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads')) 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
  
});

const upload = multer({ storage: storage });
module.exports = upload;


// (req, res) => {
// if (!req.file) {
//   return res.status(400).json({
//     status:false,
//     msg:'No files were uploaded.'
//   });
// } else { 
//   return res.status(400).json({
//     status:true,
//     file: req.file,
//     msg:'File uploaded successfully.'
//   });
// }