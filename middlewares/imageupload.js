require('dotenv').config();
const path = require("path");
const multer = require("multer");

exports.upload = (req, res, next) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
           cb(null, 'public/');
        },
        filename: function (req, file, cb) {
           let ex = file.originalname.split('.');
           console.log(ex) 
           cb(null, 'img' + Date.now() + parseInt(Math.random() * (99 - 10) + 10) + '.' + ex[ex.length - 1]);
        }
     });

     function fileFilter(req, file, cb) {
        const fileType = file.mimetype.split('/')[0] == 'image';
        if (fileType) cb(null, true);
        else cb(null, false);
     }
     
     const upload = multer({
        storage: storage,
        fileFilter: fileFilter
     });
}