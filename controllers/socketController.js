// 소켓 리스트 관련
const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");
const User = require("../schema/user");
const ChatRoom = require("../schema/chatroom");
const Like = require("../schema/like");
const Alert = require("../schema/alert");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const pricehistory = require("../schema/pricehistory");

exports.bid = async (req, res) => {
	const user = res.locals.user;
	const { id } = req.params;
	try {
		let result = true;
		const { bid } = req.body;
		const product = await Product.findById(id);
		const bidList = await PriceHistory.find({ productId: id });
		//console.log(bidList);
		//console.log("===두번째디버깅===", price);

		const lowBid = await product.lowBid;
		console.log("시작가", lowBid);

		//입찰 시 시작가보다 낮거나 같을 때
		if (lowBid >= bid) {
			result = false;
			return res.status(403).send({ result });
		}
		//경매 기간이 지났을 경우
		let now = new Date();
		if (product.deadLine < now) {
			result = false;
			return res.status(403).send({ result });
		}
		//입찰 시 이전 입찰가보다 낮거나 같을 때
		if (bidList[0] && bidList[bidList.length - 1].bid >= bid) {
			result = false;
			return res.status(403).send({ result });
		}
		result = await pricehistory.create({
			userId: user["_id"],
			bid,
			productId: id,
		});
		res.send({ result });
	} catch (error) {
		console.error(error);
		res.send({ error });
	}
};

exports.sucbid = async (req, res) => {
	const user = res.locals.user;
	const productId = req.params;
	const { sucbid, sellerunique } = req.body;

	console.log(user["_id"], productId["id"]);

	try {
		const one = await Product.findOneAndUpdate(
			{ _id: productId["id"] },
			{ onSale: false }
		);
		const two = await PriceHistory.create({
			userId: user["_id"],
			productId: productId["id"],
			currentPrice: sucbid,
		});
		const three = await ChatRoom.create({
			productId: productId["id"],
			buyerId: user["_id"],
			sellerId: sellerunique,
		});

		console.log(one, two, three);

		// const a = await PriceHistory.find({productId:productId["id"]});
		// console.log(a);

		// await Alert.create({alertType:"즉시낙찰",productId:productId["id"],userId});
		res.send({ msg: "메인페이지로 reload합니다" });
	} catch (error) {
		res.send({ msg: "즉시낙찰에 실패하였습니다." });
	}
};

// 바로 알림
exports.alert = async (req, res) => {
	try {
	} catch (error) {}
};
