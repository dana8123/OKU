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
	res.send({result:"test"});
};

exports.test02 = async (req, res) => {
	const { test } = req.body;
	console.log(test);
	console.log(req.body);
	res.send(req.body);
};

exports.productpost = async (req, res) => {
    const user = res.locals.user;

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

    // const file = req.file.path;
    // console.log(req.file.path);

    try {
        await Product.create({
            title:title,
            img: image,
            nickname:user["nickname"],
            sellerunique:user["_id"],
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

exports.popular = async (req, res) => {
    try {
        const a = await Product.find({}).sort("-views").limit(3);
        console.log(a);
        res.send({ okay:true,result: a });
    } catch (error) {
        res.send({okay:false });
    }
};

exports.newone = async(req,res)=>{
    try {
        const a = await Product.find({}).sort("-createAt").limit(3);
        console.log(a);
        res.send({ okay:true,result: a });
    } catch (error) {
        res.send({okay:false });
    }
};

exports.detail = async (req, res) => {
	// res.send(req.params);
	// console.log(req.params["id"]);
	try {
        const product = await Product.findOneAndUpdate({ _id: req.params["id"] }, { $inc: { views: 1 } }, { __v: 0 });
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
