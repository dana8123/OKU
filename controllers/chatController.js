require("dotenv");

//채팅 리스트
exports.chatList = async (req, res) => {
	const nodemailer = require("../nodemailer");
	const Product = require("../schema/product");
	const user = res.locals.user;

	let targets = [
		{
			soldBy: user.nickname,
			_id: 1,
			title: `운영자`,
			nickname: `오쿠`,
			sellerunique: process.env.ADMIN_ID,
			soldById: user._id,
		},
	];
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
	const titleOfProduct = product[product.length - 1].title;
	const subject = titleOfProduct + "거래가 성사되었습니다.";
	// 판매자인경우와 구매자인 경우 모두 채팅리스트(targets)로 응답
	for (let i = 0; i < product.length; i++) {
		// 현재 로그인 한 유저가 낙찰자일 경우
		if (product[i].soldById == user._id) {
			targets.push(product[i]);
		}
		if (product[i].sellerunique == user._id) {
			//현재 로그인 한 유저가 판매자일 경우
			targets.push(product[i]);
		}
	}
	
	//채팅 리스트 출력하는 console
	//console.log("TARGET =>", targets);
	res.send({ targets });
};

// 채팅방 삭제
exports.chatDelete = async (req, res) => {
	const Chat = require("../schema/chathistory");
	const Product = require("../schema/product");
	const { params: product, firstUser, secondUser } = req;
	const { User } = require("../schema/user");

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
