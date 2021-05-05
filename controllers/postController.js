// 상품등록관련
require("dotenv").config();
const multer = require("multer");
const Product = require("../schema/product");
const User = require("../schema/user");
const jwt = require("jsonwebtoken");
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

//상품 등록하기
exports.productpost = async (req, res, next) => {
	const user = res.locals.user;

	try {
		let images = [];
		let image = "";
		for (let i = 0; i < req.files.length; i++) {
			image = req.files[i].filename;
			images.push(`http://${process.env.DB_SERVER}/` + image);
		}

		const {
			title,
			img,
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
			duration,
		} = req.body;

		const addTime = (date, milliseconds) => {
			return new Date(date.getTime() + milliseconds * 1);
		};

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
			deadLine: addTime(new Date(), duration),
		});

		res.send({ msg: "상품이 등록되었습니다" });
	} catch (error) {
		if (error instanceof multer.MulterError) {
			console.log("multer error", error);
			res.send({ msg: "multer error" });
		}
		res.send({ msg: "상품 등록에 실패하였습니다.", error });
	}
};

//상품 목록 조회순으로 불러오기
exports.popular = async (req, res) => {
	try {
		const popularList = await Product.aggregate([
			{ $sort: { views: -1 } },
			{ $limit: 3 },
		]);
		res.send({ okay: true, result: popularList });
	} catch (error) {
		res.send({ okay: false, error });
	}
};

//상품 목록 최신순으로 불러오기
exports.newone = async (req, res) => {
	let productList = [];
	//마지막으로 불러들인 아이템, query문으로 받아옴.
	let lastId = req.query["lastId"];
	let products;
	const print_count = 9;
	try {
		//무한스크롤
		if (lastId) {
			//무한스크롤 도중일 경우
			products = await Product.find({})
				.sort({ createAt: -1 })
				.where("_id")
				.lt(lastId)
				.limit(print_count);
			console.log("lastId", products);
		} else {
			//처음 페이지에서 스크롤을 내리기 시작할 때
			products = await Product.find({})
				.sort({ createAt: -1 })
				.limit(print_count);
		}
		productList.push(products);
		res.send({ okay: true, productList });
	} catch (error) {
		res.send({ okay: false, error });
		console.log(error);
	}
};

//마감임박 상품 목록 뿌려주기
//수정중
exports.deadLineList = async (req, res) => {
	const halfHour = 86400000;
	const date = Date.now();
	try {
		const list = await Product.aggregate([
			{
				$project: {
					deadLine: {
						$gte: [date, "deadLine"],
					},
				},
			},
		]);
		res.send({ list });
	} catch (error) {
		res.send({ error });
		console.error(error);
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

exports.quest = async (req, res) => {
	try {
	} catch (error) {}
};

// 나중으로 미뤄둔 낙찰입찰
exports.bidding = async (req, res) => {
	// const user = res.locals.user;
	try {
	} catch (error) {}
};
