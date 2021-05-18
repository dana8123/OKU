// 상품등록관련
require("dotenv").config();
const multer = require("multer");
const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");
const Alert = require("../schema/alert");
const User = require("../schema/user");
const jwt = require("jsonwebtoken");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const upload = require("../middlewares/imageupload.js");
const schedule = require("node-schedule");

//상품 등록하기
exports.productpost = async (req, res, next) => {
	const user = res.locals.user;

	try {
		let images = [];
		if (req.files.length != 0) {
			for (let i = 0; i < req.files.length; i++) {
				images.push(req.files[i].location);
			}
		}
		console.log("없는사진을왜올려", images);

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
			duration,
		} = req.body;

		const addTime = (date, milliseconds) => {
			return new Date(date.getTime() + milliseconds * 1);
		};

		const newProduct = await Product.create({
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
		newProduct.save();
		console.log("새로등록한 상품의 id", newProduct._id);
		console.log("새로등록한 상품의 마감일", newProduct.deadLine);

		schedule.scheduleJob(newProduct.deadLine, async () => {
			//TODO: 입찰자가 있을 때와 없을 때로 구분
			const success = [];
			const pricehistory = await PriceHistory.find({
				productId: newProduct._id,
			});

			// for (let i; i < pricehistory.length; i++) {
			// 	success.push(pricehistory[i]);
			// }

			console.log(newProduct._id);
			console.log(pricehistory);
			console.log(pricehistory.length);

			//입찰내역이 없을 때
			if (pricehistory.length == 0) {
				await newProduct.updateOne({
					$set: {
						onSale: false,
						soldBy: "낙찰자가 없음",
						soldById: "낙찰자가 없음",
					},
				});
				// 입찰내역이 없을 때 판매자에게 판매실패 알람
				await Alert.create({
					alertType: "판매실패",
					productTitle: newProduct["title"],
					productId: newProduct["_id"],
					userId: user.id,
				});
			}

			//입찰내역이 1개 이상 있을 때
			else {
				await newProduct.updateOne({
					$set: {
						onSale: false,
						soldBy: pricehistory[0].nickName,
						soldById: pricehistory[0].userId,
					},
				});

				// 여기서 낙찰 성공자 & 실패자 나눠서 두번 알람을 보내야함

				// 낙찰 성공자에게 알림
				await Alert.create({
					userId: pricehistory[0].userId,
					alertType: "낙찰성공",
					productTitle: newProduct["title"],
					productId: newProduct["_id"],
				});

				// 낙찰성공유저제외 history에 있는 이전 유저들
				const a = await PriceHistory.find(
					{
						$and: [
							{ productId: newProduct._id },
							{ userId: { $ne: pricehistory[0].userId } },
						],
					},
					{ userId: 1, _id: 0 }
				);

				//낙찰 실패자에게 알림
				await Alert.insertMany(
					a.map((user) => ({
						alertType: "낙찰실패",
						productId: newProduct["_id"],
						productTitle: newProduct["title"],
						userId: user.userId,
					}))
				);
			}
		});

		res.send({ msg: "상품이 등록되었습니다" });
	} catch (error) {
		if (error instanceof multer.MulterError) {
			console.log("multer error", error);
			res.send({ msg: "multer error" });
		}
		res.send({ msg: "상품 등록에 실패하였습니다.", error });
		console.log(error);
	}
};

//상품 목록 조회순으로 불러오기
exports.popular = async (req, res) => {
	try {
		// onSale:true
		const popularList = await Product.aggregate([
			{ $match: { onSale: true } },
			{ $sort: { views: -1, date: -1 } },
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
			products = await Product.find({ onSale: true })
				.sort({ createAt: -1 })
				.where("_id")
				.lt(lastId)
				.limit(print_count);
			console.log("lastId", products);
		} else {
			//처음 페이지에서 스크롤을 내리기 시작할 때
			products = await Product.find({ onSale: true })
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
exports.deadLineList = async (req, res) => {
	const halfHour = 1800000;
	const today = new Date();
	const list = [];
	try {
		//주어진 시각에서 30분을 빼는 함수
		const calTime = (date, milliseconds) => {
			return new Date(date.getTime() - milliseconds * 1);
		};
		const products = await Product.find({});
		//전체 상품의 deadLine list 중 30분만 남은 제품 불러오기
		for (let i = 0; i < products.length; i++) {
			const toDeadLine = calTime(products[i].deadLine, halfHour);
			//deadLine이 30분 미만으로 남았고,
			//마감이 되지 않은 경우
			if (today > toDeadLine && products[i].deadLine > today) {
				list.push(products[i]);
			}
		}
		if (list.length == 0) {
			return res.send({ result: "empty" });
		}
		res.send({ result: list });
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

		const user = await User.findOne(
			{ _id: product["sellerunique"] },
			{ profileImg: 1, nickname: 1, _id: 1 }
		);
		res.json({ okay: true, result: product, seller: user });
	} catch (error) {
		res.send({ okay: false });
	}
};

exports.relate = async (req, res) => {
	// 소분류 카테고리값 받는게 더 나을것같음
	const { smallCategory, tag } = req.body;

	// console.log(product);
	try {
		// 첫번째 이미지 + lowbid + title + bid(현재입찰가)
		// onsale:true만
		const a = await Product.find(
			{
				$or: [
					{ tag: new RegExp(tag) },
					{ smallCategory: new RegExp(smallCategory) },
				],
			},
			{ img: 1, title: 1, lowBid: 1, sucBid: 1, _id: 1 }
		).limit(4);

		res.send({ okay: true, result: a });
	} catch (error) {
		res.send({ okay: false });
	}
};
