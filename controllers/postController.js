// 상품등록관련
require("dotenv").config();
const user = require("../schema/user");
const Product = require("../schema/product");
// const user = require("../schema/user");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const { upload } = require("../middlewares/imageupload.js");

exports.productpost = async (req, res) => {
	let image = [];
	if (req["file"]) {
		images = req.file.filename;
		image =
			`http://${process.env.DB_SERVER}:${process.env.DB_PORT}/` +
			req.file.filename;
	}

	const {
		title,
		nickname,
		lowbid,
		sucbid,
		state,
		description,
		tag,
		bigCategory,
		smallCategory,
		region,
		deliveryprice,
		deadline,
	} = req.body;

	const file = req.file.path;
	console.log(req.file.path);
	try {
		await Product.create({
			title,
			img: image,
			nickname,
			lowBid: lowbid,
			sucBid: sucbid,
			state: state,
			description: description,
			tag: tag,
			bigCategory: bigCategory,
			smallCategory: smallCategory,
			region: region,
			deliveryPrice: deliveryprice,
			deadLine: deadline,
		});
		res.send({ msg: "상품이 등록되었습니다" });
	} catch (error) {
		res.send({ msg: "상품이 등록에 실패하였습니다.", error });
	}
};

exports.detail = async (req, res) => {
	// res.send(req.params);
	// console.log(req.params["id"]);

	try {
		const product = await Product.findOne(
			{ _id: req.params["id"] },
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
