require("dotenv").config();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
	},
});

exports.upload = multer({ storage });

// exports.upload = (req, res, next) => {
//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//            cb(null, 'public/');
//         },
//         filename: function (req, file, cb) {
//            let ex = file.originalname.split('.');
//            console.log(ex)
//            cb(null, 'img' + Date.now() + parseInt(Math.random() * (99 - 10) + 10) + '.' + ex[ex.length - 1]);
//         }
//      });

//      function fileFilter(req, file, cb) {
//         const fileType = file.mimetype.split('/')[0] == 'image';
//         if (fileType) cb(null, true);
//         else cb(null, false);
//      }

//      const upload = multer({
//         storage: storage,
//         fileFilter: fileFilter
//      });
// }
