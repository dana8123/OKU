require("dotenv").config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const aws = require("aws-sdk");
aws.config.loadFromPath(__dirname + "/../config/s3.json");

const s3 = new aws.S3();
const upload = multer(
	{
		storage: multerS3({
			s3,
			bucket: "okuhanghae",
			contentType: multerS3.AUTO_CONTENT_TYPE,
			acl: "public-read",
			key: function (req, file, cb) {
				cb(null, Date.now() + "." + file.originalname.split(".").pop());
			},
		}),
	},
	"NONE"
);

module.exports = upload;

//기존 upload folder에 저장할 때 사용하던 코드

/*const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
	},
});

exports.upload = multer({ storage });
*/
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
