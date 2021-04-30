// 상품등록관련
require("dotenv").config();
const Product = require("../schema/product");
const User = require("../schema/user");
const jwt = require("jsonwebtoken");
// const user = require("../schema/user");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const { upload } = require("../middlewares/imageupload.js");

exports.test = async (req, res) => {
	const user = res.locals.user;
	console.log(user);
	res.send({ result: "test" });
};

exports.test02 = async (req, res) => {
	const { test } = req.body;
	console.log(test);
	console.log(req.body);
	res.send(req.body);
};

exports.productpost = async (req, res, next) => {
	const user = res.locals.user;
	try {
		let images = [];
		let image = "";
		for (let i = 0; i < req.files.length; i++) {
			image = req.files[i].filename;
			images.push(
				`http://${process.env.DB_SERVER}:${process.env.DB_PORT}/` + image
			);
		}

		const {
			title,
			lowbid,
			sucbid,
			state,
			description,
			tag,
			bigCategory,
			smallCategory,
			region,
			deliveryprice,
			deadLine,
		} = req.body;

		await Product.create({
			title,
			img: images,
			nickname: user["nickname"],
			sellerunique: user["_id"],
			lowBid: lowbid,
			sucBid: sucbid,
			state: state,
			description: description,
			tag: tag,
			bigCategory: bigCategory,
			smallCategory: smallCategory,
			region: region,
			deliveryPrice: deliveryprice,
			deadLine,
		});

		res.send({ msg: "상품이 등록되었습니다" });
	} catch (error) {
		if (error instanceof multer.MulterError) {
			console.log("multer error", error);
			res.send({ msg: "multer error" });
		}
		res.send({ msg: "상품이 등록에 실패하였습니다.", error });
	}
};

exports.popular = async (req, res) => {
	try {
		const popularList = await Product.aggregate([
			{ $sort: { views: -1 } },
			{ $limit: 3 },
		]);
		console.log(popularList);
		res.send({ okay: true, result: popularList });
	} catch (error) {
		res.send({ okay: false, error });
	}
};

exports.newone = async (req, res) => {
	try {
		const a = await Product.find({}).sort("-createAt").limit(3);
		console.log(a);
		res.send({ okay: true, result: a });
	} catch (error) {
		res.send({ okay: false });
	}
};

exports.detail = async (req, res) => {
	// res.send(req.params);
	// console.log(req.params["id"]);
	try {
		const product = await Product.findOneAndUpdate(
			{ _id: req.params["id"] },
			{ $inc: { views: 1 } },
			{ __v: 0 }
		);
		res.json({ okay: true, result: product });
	} catch (error) {
		res.send({ okay: false });
	}
};

exports.bidding = async (req, res) => {
	// const user = res.locals.user;
	try {
	} catch (error) {}
};
