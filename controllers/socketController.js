//입찰하기
exports.bid = async (req, res) => {
	const user = res.locals.user;
	const { id } = req.params;
	try {
		const Joi = require("@hapi/joi");
		let result = false;
		const Product = require("../schema/product");
		const product = await Product.findById(id);
		const PriceHistory = require("../schema/pricehistory");
		const seller = product.sellerunique;
		const { User } = require("../schema/user");
		const bidList = await PriceHistory.find({
			productId: id,
		});
		const nodemailer = require("../nodemailer");

		// bid의 유효성 검사
		console.log(product["sucBid"]);

		const bidSchema = Joi.object({ bid: Joi.number().max(product["sucBid"]) });
		const { bid } = await bidSchema.validateAsync(req.body);

		const lowBid = await product.lowBid;
		console.log("시작가", lowBid);

		// 입찰자와 판매자가 동일한경우
		if (user["_id"] == seller) {
			result = "seller";
			return res.status(403).send({ result });
		}
		//console.log("경매내역", bidList);
		//입찰 시 시작가보다 낮거나 같을 때
		if (lowBid > bid) {
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
		//입찰하기에서 즉시 입찰가 혹은 그 이상을 입력했을 때, 입찰불가
		if (bid >= product.sucBid) {
			result: "입찰가 오류";
			return res.status(403).send({ result });
		}

		//이외 입찰하기가 성공되었을 때
		result = await pricehistory.create({
			userId: user["_id"],
			bid,
			productId: product._id,
			nickName: user.nickname,
			userEmail: user.email,
		});
		// 판매자에게 입찰정보 메일링
		const sellerInfo = await User.findOne({ _id: seller });
		const subject = product.title + "입찰되었습니다!";
		nodemailer(sellerInfo.email, subject);

		res.send({ result });
	} catch (error) {
		console.error(error);
		res.send({ error });
	}
};

//즉시 낙찰하기
exports.sucbid = async (req, res) => {
	const Alert = require("../schema/alert");
	const ChatRoom = require("../schema/chatroom");
	const user = res.locals.user;
	const Product = require("../schema/product");
	const productId = req.params;
	const PriceHistory = require("../schema/pricehistory");
	const { sucbid, sellerunique } = req.body;

	try {
		if (sellerunique == user.id) {
			res.send({ msg: "판매자는 낙찰하지 못합니다." });
		} else {
			try {
				const hisinfo = await PriceHistory.create({
					productId: productId["id"],
					userId: user["_id"],
					bid: sucbid,
					nickName: user["nickname"],
					userEmail: user["email"],
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
						productTitle: product["title"],
						userId: user.userId,
					}))
				);

				//낙찰 성공자에게 알림
				await Alert.create({
					userId: user["_id"],
					alertType: "낙찰성공",
					productTitle: product["title"],
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
		}
	} catch (error) {
		console.log(error);
		res.send({ msg: "즉시낙찰에 실패하였습니다." });
	}
};

// 변경된 즉시낙찰로직
exports.newsucbid = async (req, res) => {
	const Alert = require("../schema/alert");
	const user = res.locals.user;
	const Product = require("../schema/product");
	const productId = req.params;
	const PriceHistory = require("../schema/pricehistory");
	const { sucbid, sellerunique } = req.body;
	// 이미 즉시 낙찰된 기록이 있을 경우 onSale:true , history가 이미 있는경우
	const prehistory = await Alert.findOne({
		alertType: "판매성공",
		productId: productId["id"],
	});

	// 판매 종료된것도 즉시낙찰 못하게 막아야함
	try {
		// 판매자가 상품을 산다면
		if (sellerunique == user.id) {
			return res.send({ okay: false, msg: "판매자는 낙찰하지 못합니다." });
			// 판매자 이외의 구매자가 즉시낙찰을 시도함
		} else {
			// 이미 누군가 즉시낙찰을 했다면
			if (prehistory) {
				return res.send({ okay: false, msg: "이미 거래중인 물건입니다." });
				// 즉시낙찰 내역이 없는 경우
			} else {
				console.log("sucbid===> db create", sucbid);
				await PriceHistory.create({
					productId: productId["id"],
					userId: user["_id"],
					bid: sucbid,
					nickName: user["nickname"],
				});
			}

			// 판매자한테 상품판매알람보내기
			// 즉시낙찰을 시도한사람이 있을경우 detail페이지에서 데이터는 내려가지않고 거래대기중으로 띄워줘야함
			const product = await Product.findOneAndUpdate(
				{ _id: productId["id"] },
				{ soldBy: "거래대기중" }
			);
			console.log("socketController ==>", product);
			await Alert.create({
				alertType: "판매성공",
				buyerId: user["_id"],
				productTitle: product["title"],
				productId: productId["id"],
				userId: sellerunique,
			});

			res.send({ okay: true, msg: "즉시낙찰에 성공하였습니다." });
		}
	} catch (error) {
		console.log(error);
		res.send({ msg: "즉시낙찰에 실패하였습니다.", error });
	}
};

// 유저정보 조회
// 알림안에있는 buyerId값으로 불러옴
exports.buyerCheck = async (req, res) => {
	const { id } = req.params;
	const { User } = require("../schema/user");

	try {
		const buyer = await User.findOne(
			{ _id: id },
			{ nickname: 1, profileImg: 1, _id: 0 }
		);
		res.send({ okay: true, user: buyer });
	} catch (error) {
		res.send({ okay: false, msg: "유저가 존재하지 않습니다." });
	}
};

// 거래진행 yes or no로 나누어야함
exports.sellerSelct = async (req, res) => {
	// 1. true false값 , 2. 판매성공 알람 objectId값이 필요함
	const Alert = require("../schema/alert");

	const { decision } = req.body;
	// 알람 objectId값임
	const ChatRoom = require("../schema/chatroom");
	const { id } = req.params;
	const Product = require("../schema/product");
	const PriceHistory = require("../schema/pricehistory");
	const { User } = require("../schema/user");

	//console.log(decision, id);

	try {
		// 판매자인지 아닌지도 걸려줘야함

		if (decision == true) {
			// 거래 진행에 동의한 경우
			// 1. 판매상품 내리기 2. 채팅방 생기기 3. 구매자들에게 성공알림, 구매실패자들에게 실패알림

			const info = await Alert.findOne({ _id: id });
			const buyer = await User.findOne({ _id: info["buyerId"] });

			console.log("info:", info, "buyer:", buyer);

			// 판매상품 상태 변경
			const a = await Product.findOneAndUpdate(
				{ _id: info["productId"] },
				{ onSale: false, soldBy: buyer["nickname"], soldById: buyer["_id"] }
			);

			// 채팅방 생성
			const b = await ChatRoom.create({
				productId: info["productId"],
				buyerId: info["buyerId"],
				sellerId: info["userId"],
			});

			// 낙찰성공유저제외 history에있는 모든 유저 불러오기
			const failUser = await PriceHistory.find(
				{
					$and: [
						{ productId: info["productId"] },
						{ userId: { $ne: info["buyerId"] } },
					],
				},
				{ userId: 1, _id: 0 }
			);

			//낙찰 실패자에게 알림
			const tt = await Alert.insertMany(
				failUser.map((user) => ({
					alertType: "낙찰실패",
					productId: info["id"],
					productTitle: info["productTitle"],
					userId: user.userId,
				}))
			);

			//낙찰 성공자에게 알림
			const tt2 = await Alert.create({
				userId: info["buyerId"],
				alertType: "낙찰성공",
				productTitle: info["productTitle"],
				productId: info["productId"],
			});

			// 판매완료(거래진행중) > 거래완료
			await Alert.findOneAndUpdate({ _id: id }, { alertType: "거래완료" });

			return res.send({ okay: true, msg: "상품이 판매 완료 됐습니다." });
		} else {
			// 거래 진행에 거절한 경우
			// alert하나 삭제하기

			const info = await Alert.findOne({ _id: id });
			const buyer = await User.findOne({ _id: info["buyerId"] });

			//낙찰 시도자에게 실패 알림
			await Alert.create({
				userId: info["buyerId"],
				alertType: "낙찰실패",
				productTitle: info["productTitle"],
				productId: info["productId"],
			});

			const a = await Product.findOneAndUpdate(
				{ _id: info["productId"] },
				{ onSale: true, soldBy: null, soldById: null }
			);
			await PriceHistory.deleteOne({
				productId: info["productId"],
				userId: info["buyerId"],
			});

			await Alert.deleteOne({ _id: id });

			return res.send({ okay: true, msg: "거래가 취소되었습니다." });
		}

		return res.send({ okay: true });
	} catch (error) {
		res.send({ okay: false, msg: "없는 거래입니다." });
	}
};

// 바로 알림
exports.alert = async (req, res) => {
	const Alert = require("../schema/alert");
	const user = res.locals.user;
	try {
		const notCheck = await Alert.find({
			userId: user["_id"],
			view: false,
		}).sort("-creatAt");
		const alreadyCheck = await Alert.find({
			userId: user["_id"],
			view: true,
		}).sort("-creatAt");

		await Alert.updateMany(
			{ userId: user["_id"], view: false },
			{ $set: { view: true } }
		);

		res.send({ okay: true, notCheck: notCheck, alreadyCheck: alreadyCheck });
	} catch (error) {
		res.send({ okay: false });
	}
};

// 이전 입찰정보 불러오기
exports.bidinfo = async (req, res) => {
	const productId = req.params;
	const PriceHistory = require("../schema/pricehistory");

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
