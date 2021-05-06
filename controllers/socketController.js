// 소켓 리스트 관련
const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");
const ChatRoom = require("../schema/chatroom");
const User = require("../schema/user");
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
		const price = PriceHistory.find().where("productId").equals();
		//console.log(price);

		//입찰 시 시작가보다 낮거나 같을 때
		const lowBid = await product.lowBid;
		console.log("최저입찰가", lowBid);
		if (lowBid >= bid) {
			result = false;
			return res.status(403).send({ result });
		}
		//TODO:입찰 시 이전 입찰가보다 낮거나 같을 때
		// if (pricehistory.currentPrice && product.currentPrice) {
		// 	result = false;
		// 	return res.status(403).send({ result });
		// }
		result = await pricehistory.create({
			info: {
				userId: user["nickname"],
				bid,
			},
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

	// console.log(user["_id"], productId["id"]);
    // console.log(sucbid,sellerunique);

	try {
		const one = await Product.findOneAndUpdate(
			{ _id: productId["id"]},
			{ onSale: false }
		);
		const two = await PriceHistory.create({productId:productId["id"],userId:user["_id"],bid:sucbid});
		const three = await ChatRoom.create({
			productId: productId["id"],
			buyerId: user["_id"],
			sellerId: sellerunique,
		});

        // 즉시낙찰유저제외 history에있는 모든 유저 불러오기
		const a = await PriceHistory.find({$and:[{productId:productId["id"]},{userId:{$ne:user["_id"]}}]});
		console.log(a);

        // a로 불러온 낙찰 성공 제외 다른 유저들에게 알람 보내기
		// await Alert.create({alertType:"낙찰실패",productId:productId["id"],userId:"반복문??"});

        // await Alert.insertMany({alertType:"낙찰실패",productId:productId["id"],userId:a["userId"]
        // });

        // // 상품 낙찰 성공 알람 보내기
		// await Alert.create({alertType:"낙찰성공",productId:productId["id"],userId:user["_id"]});


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
