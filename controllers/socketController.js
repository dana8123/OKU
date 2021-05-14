// 소켓 리스트 관련
const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");
const ChatRoom = require("../schema/chatroom");
const User = require("../schema/user");
const Like = require("../schema/like");
const Alert = require("../schema/alert");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const pricehistory = require("../schema/pricehistory");
const product = require("../schema/product");

//입찰하기
exports.bid = async (req, res) => {
	const user = res.locals.user;
	const { id } = req.params;
	try {
		let result = true;
		const { bid } = req.body;
		const product = await Product.findById(id);
		const seller = product.sellerunique;
		const bidList = await PriceHistory.find({
			productId: id,
		});

		const lowBid = await product.lowBid;
		console.log("시작가", lowBid);
		
		// 입찰자와 판매자가 동일한경우
		if (user["_id"]==seller){
			result = "seller";
			return res.status(403).send({ result });
		}
		//console.log("경매내역", bidList);
		//입찰 시 시작가보다 낮거나 같을 때
		if (lowBid >= bid) {
			result = "lowBid";
			return res.status(403).send({ result });
		}
		//경매 기간이 지났을 경우
		let now = new Date();
		if (product.deadLine < now) {
			result = "time";
			return res.status(403).send({ result });
		}
		//입찰 시 이전 입찰가보다 낮거나 같을 때
		if (bidList[0] && bidList[bidList.length - 1].bid >= bid) {
			result = "before";
			return res.status(403).send({ result });
		}
		// TODO: onSale항목이 false일 때
		if ((product.onSale = false)) {
			result: "already successed Bidding";
			return res.status(403).send({ result });
		}
		//입찰하기에서 즉시 입찰가 혹은 그 이상을 입력했을 때
		if (bid >= product.sucBid) {
			result = await pricehistory.create({
				userId: user["_id"],
				bid,
				productId: product._id,
				nickName: user["nickname"],
				seller,
			});
			//입찰하기에서 즉시입찰가 입력하여 판매종료될 경우.
			await product.updateOne({
				$set: { onSale: false, soldBy: user.nickname, soldById: user._id },
			});

			return res.send({ result: "마감" });
		}
		//이외 입찰하기가 성공되었을 때
		result = await pricehistory.create({
			userId: user["_id"],
			bid,
			productId: product._id,
			nickName: user.nickname,
		});
		res.send({ result });
	} catch (error) {
		console.error(error);
		res.send({ error });
	}
};

//즉시 낙찰하기
// 판매자가 낙찰 불가능하게 만들기
exports.sucbid = async (req, res) => {
	const user = res.locals.user;
	const productId = req.params;
	const { sucbid, sellerunique } = req.body;

	try {

		try {
			const hisinfo = await PriceHistory.create({
				productId: productId["id"],
				userId: user["_id"],
				bid: sucbid,
				nickName: user["nickname"],
			});
		} catch (error) {
			res.send({ msg: "낙찰 기록에 실패했습니다." });
		}

		try {

			// 상품 판매 상태 false로 변경
			const product = await Product.findOneAndUpdate(
				{ _id: productId["id"] },
				{ onSale: false, soldBy: user.nickname, soldById: user._id }
			);

			// 즉시낙찰유저제외 history에있는 모든 유저 불러오기
			const a = await PriceHistory.find(
				{
					$and: [
						{ productId: productId["id"] },
						{ userId: { $ne: user["_id"] } },
					],
				},
				{ userId: 1, _id: 0 }
			);

			//낙찰 실패자에게 알림
			await Alert.insertMany(
				a.map((user) => ({
					alertType: "낙찰실패",
					productId: productId["id"],
					productTitle:product["title"],
					userId: user.userId,
				}))
			);

			//낙찰 성공자에게 알림
			await Alert.create({
				userId: user["_id"],
				alertType: "낙찰성공",
				productTitle:product["title"],
				productId: productId["id"],
			});

		} catch (error) {
			res.send({ msg: "제품이 존재하지 않습니다." });
		}

		try {
			await ChatRoom.create({
				productId: productId["id"],
				buyerId: user["_id"],
				sellerId: sellerunique,
			});
		} catch (error) {
			res.send({ msg: "채팅방 생성에 실패했습니다." });
		}

		res.send({ msg: "즉시낙찰에 성공하였습니다." });
	} catch (error) {
		console.log(error);
		res.send({ msg: "즉시낙찰에 실패하였습니다." });
	}
};

// 바로 알림
exports.alert = async (req, res) => {
	const user = res.locals.user;

	try {
		const notCheck = await Alert.find({ userId: user["_id"], view: false });
		const alreadyCheck = await Alert.find({ userId: user["_id"], view: true });

		console.log(notCheck,alreadyCheck);

		await Alert.updateMany(
			{ userId: user["_id"], view: false },
			{ $set: { view: true } }
		);

		res.send({ okay: true, notCheck: notCheck, alreadyCheck: alreadyCheck });
	} catch (error) {
		res.sned({ okay: false });
	}
};

// 이전 입찰정보 불러오기
exports.bidinfo = async (req, res) => {
	const productId = req.params;

	try {
		const info = await PriceHistory.find(
			{ productId: productId["id"] },
			{ nickName: 1, bid: 1, createAt: 1, _id: 0 }
		);

		if (info.length < 1) {
			res.send({ okay: false, msg: "현재입찰자가 없습니다." });
		} else {
			res.send({ okay: true, prebid: info });
		}
	} catch (error) {
		res.send({ okay: false });
	}
};
