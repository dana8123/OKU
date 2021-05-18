// 상품 리스트 관련
const Product = require("../schema/product");
const User = require("../schema/user");
const Like = require("../schema/like");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");

exports.bigCate = async (req, res) => {
	const { bigCategory } = req.params;
	console.log(bigCategory);

	try {
		const product = await Product.find({ bigCategory: bigCategory }).sort("-createAt");
		res.send({ okay: true, result: product });
	} catch (error) {
		res.send({ okay: false });
	}
};

exports.smallCate = async (req, res) => {
	const { bigCategory, smallCategory } = req.params;
	console.log(bigCategory, smallCategory);
	try {
		const product = await Product.find({
			bigCategory: bigCategory,
			smallCategory: smallCategory,
		}).sort("-createAt");
		res.send({ okay: true, result: product });
	} catch (error) {
		res.send({ okay: false });
	}
};

exports.search = async (req, res) => {
	console.log(req.query);
	try {
		const a = req.query["term"];
		const product = await Product.find(
			{ $or: [{ tag: new RegExp(a) }, { title: new RegExp(a) }] },
			{ __v: 0 }
		);
		console.log(product);
		res.send({ okay: true, result: product });
	} catch (error) {
		res.send({ okay: false });
	}
};

exports.pick = async (req, res) => {
	const user = res.locals.user;
	const productId = req.params;
	const product = await Product.find(
		{ _id: productId["id"] },
		{ img: 1, sellerunique: 1 }
	);

	
	try {
		// 찜 두번하는 것 막아두기
		const likeExiest = await Like.findOne({userId: user["_id"],productId: productId["id"]})

		if(likeExiest!==null){
			res.send({msg: "이미 찜한 상품입니다."})
		}else{
			await Like.create({
				userId: user["_id"],
				productId: productId["id"],
				productImage: product[0]["img"][0],
				sellerId: product[0]["sellerunique"],
			});
			res.send({ msg: "찜이 등록되었습니다." });

		}
	} catch (error) {
		res.send({ msg: "찜에 실패하였습니다." });
		console.log(error);
	}
};

exports.gayeonpick = async (req, res) => {
	// 추천해주는 사람의 아이디
	const md = "admin";

	try {
		// 필요한 정보 제품이름,제품사진,현재입찰가
		const user = await User.findOne({ nickname: md });

		const like = await Like.find(
			{ userId: user["_id"] },
			{ productId: 1, _id: 0 }
		).limit(3);

		const find = [];

		for (let i = 0; i < like.length; i++) {
			find.push(like[i]["productId"]);
		}

		const recommend = await Product.find({ _id: { $in: find } }, { __v: 0 });

		if (recommend.length < 1) {
			res.send({ okay: false, result: false });
		} else {
			res.send({ okay: true, result: recommend });
		}
	} catch (error) {
		res.send({ okay: false });
	}
};
