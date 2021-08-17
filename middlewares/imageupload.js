require("dotenv").config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const aws = require("aws-sdk");
aws.config.loadFromPath(__dirname + "/../config/s3.json");

const s3 = new aws.S3();

const fileFilter = function (req, file, cb) {
	const name = path.extname(file.originalname);
	try {
		if (file.mimetype.includes("image")) {
			cb(null, true);
		} else {
			cb(null, false);
			console.log("=====이미지없음=======");
		}
	} catch (error) {
		cb(new Error("multer file ext error"));
	}
};

const upload = multer({
	storage: multerS3({
		s3,
		bucket: "okuhanghae",
		contentType: multerS3.AUTO_CONTENT_TYPE,
		acl: "public-read",
		key: function (req, file, cb) {
			cb(null, Date.now() + "." + file.originalname.split(".").pop());
			//console.log(file);
		},
	}),
	fileFilter,
});

module.exports = upload;
