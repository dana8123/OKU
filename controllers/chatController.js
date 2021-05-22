const Chat = require("../schema/chathistory");
const Room = require("../schema/chatroom");
const PriceHistory = require("../schema/pricehistory");
const Product = require("../schema/product");
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
	res.send({ targets });
};

// 채팅방 삭제
exports.chatDelete = async (req, res) => {
	const { params: id } = req;
	try {
		await Chat.deleteOne({ room: id });
	} catch (error) {
		console.log(error);
		res.send({ result: true });
	}
};
