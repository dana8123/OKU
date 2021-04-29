// 상품등록관련
require("dotenv").config();
const user = require("../schema/user");
const Product = require("../schema/product");
// const user = require("../schema/user");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const { upload } = require("../middlewares/imageupload.js");

exports.test = async (req, res) => {
	console.log(res.locals.user);
	res.send(res.locals.user);
};

exports.test02 = async (req, res) => {
	const { test } = req.body;
	console.log(test);
	console.log(req.body);
	res.send(req.body);
};

exports.productpost = async (req, res) => {
	let image = "";
	let images = [];
	let val = "";
	for (val of req.files) {
		image = val.filename;
		//image = `http://${process.env.DB_SERVER}:${process.env.DB_PORT}/` + image;
		images.push(
			`http://${process.env.DB_SERVER}:${process.env.DB_PORT}/` + image
		);
	}
	console.log("images", images);

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

	const file = req.files;
	// console.log(req.files);
	// console.log(file.length);
	// console.log(file[0].path);
	try {
		await Product.create({
			title,
			img: images,
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
    } catch (error) { }
};
