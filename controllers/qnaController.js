// 상품등록관련
require("dotenv").config();
const multer = require("multer");
const Product = require("../schema/product");
const User = require("../schema/user");
const QuestNanswer = require("../schema/questNanswer");
const Alert = require("../schema/alert");
const nodemailer = require("../nodemailer");

//post
exports.quest = async (req, res) => {
	const user = res.locals.user;
	const { contents, sellerunique } = req.body;
	const productId = req.params;

	try {
		//문의글이 올라온 상품
		const product = await Product.findOne({ _id: productId["id"] });
		console.log("문의글", product["title"]);

		const questId = await QuestNanswer.create({
			sellerId: sellerunique,
			userId: user["_id"],
			productId: productId["id"],
			contents: contents,
		});
		const seller = await User.findOne({ _id: sellerunique });
		console.log("qna판매자", seller);
		// 판매자한테 문의 알림띄우기
		await Alert.create({
			alertType: "문의",
			productTitle: product["title"],
			productId: productId["id"],
			userId: sellerunique,
		});
		// 판매자에게 메일링
		const subject = product.title + "문의가 등록되었습니다.";
		nodemailer(seller.email, subject);
		res.send({ okay: true, questId: questId["_id"] });
	} catch (error) {
		res.send({ okay: false });
	}
};

// post
exports.answer = async (req, res) => {
	const user = res.locals.user;
	const { sellerunique, contents } = req.body;
	const questId = req.params;

	try {
		// 주의할점 문의글 get할때 나오는 _id값을 기준으로 불러옴
		if (sellerunique == user["_id"]) {
			const answerOfproduct = await QuestNanswer.findOne({
				_id: questId["id"],
			});
			// 답변 작성 시 answer 항목 업데이트
			await answerOfproduct.updateOne({ answer: contents });

			const product = await Product.findOne({
				_id: answerOfproduct["productId"],
			});

			// 문의글 단 문의자한테 알림보내기
			const alert = await Alert.create({
				alertType: "문의답글",
				productTitle: product.title,
				productId: product._id,
				userId: answerOfproduct.userId,
			});
			// 문의자에게 답글에 대한 이메일 알림
			const subject = product.title + "문의글에 답변이 도착했습니다.";
			const userOfAnswer = await User.findOne({ _id: alert.userId });
			console.log("문의자에게 메일을 보내라!", userOfAnswer.email);
			nodemailer(userOfAnswer.email, subject);
			res.send({ okay: true });
		} else {
			res.send({ okay: false });
		}
	} catch (error) {
		res.send({ okay: false });
	}
};

// get
// for문 안쓰도록 수정
exports.questget = async (req, res) => {
	const productId = req.params;
	// console.log(productId["id"]);

	try {
		const result = [];
		const a = await QuestNanswer.find(
			{ productId: productId["id"] },
			{ __v: 0 }
		);

		for (let i = 0; i < a.length; i++) {
			const seller = await User.findOne({ _id: a[i]["sellerId"] });
			const buyer = await User.findOne({ _id: a[i]["userId"] });
			const sellernickname = seller["nickname"];
			const buyernickname = buyer["nickname"];
			const buyerprofile = buyer["profileImg"];

			result.push({
				QnA: a[i],
				sellernickname: sellernickname,
				buyernickname: buyernickname,
				buyerprofile: buyerprofile,
			});
		}

		console.log(result);

		res.send({ okay: true, result: result });
	} catch (error) {
		res.send({ okay: false });
	}
};
