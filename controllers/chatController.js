const Chat = require("../schema/chathistory");
const Room = require("../schema/chatroom");
const PriceHistory = require("../schema/pricehistory");
const Product = require("../schema/product");
const nodemailer = require("../nodemailer");
const User = require("../schema/user");

//채팅 리스트
exports.chatList = async (req, res) => {
	let targets = [];
	const user = res.locals.user;
	// 낙찰 완료된 상품
	const product = await Product.find(
		{ onSale: false },
		{
			_id: 1,
			title: 1,
			sellerunique: 1,
			onsale: 1,
			nickname: 1,
			soldBy: 1,
			soldById: 1,
		}
	);
	const subject = product.title + "거래가 성사되었습니다.";
	// 판매자인경우와 구매자인 경우 모두 채팅리스트(targets)로 응답
	for (let i = 0; i < product.length; i++) {
		// 현재 로그인 한 유저가 낙찰자일 경우
		if (product[i].soldById == user._id) {
			targets.push(product[i]);
			nodemailer(user.email, subject);
		}
		if (product[i].sellerunique == user._id) {
			//현재 로그인 한 유저가 판매자일 경우
			targets.push(product[i]);
			nodemailer(user.email, subject);
		}
	}
	res.send({ targets });
};

// 채팅방 삭제
exports.chatDelete = async (req, res) => {
	const { params: product, firstUser, secondUser } = req;
	try {
		await Product.deleteOne({ _id: product.product });
		await Chat.deleteMany({ productId: product.product });
		console.log("채팅방 삭제,product", product.product);
		const subject = "채팅방이 삭제되었습니다.";
		// 채팅방 삭제 시 메일 보내주기
		const first = await User.findOne({ _id: product.firstUser });
		const second = await User.findOne({ _id: product.secondUser });

		nodemailer(first.email, subject);
		nodemailer(second.email, subject);

		console.log(first.email, second.email);
		res.send({ result: true });
	} catch (error) {
		console.log(error);
		res.send({ result: false });
	}
};
