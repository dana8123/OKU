const Chat = require("../schema/chathistory");
const Room = require("../schema/chatroom");
const PriceHistory = require("../schema/pricehistory");
const Product = require("../schema/product");
const User = require("../schema/user");

//채팅목록에서 뿌려줄 채팅 리스트
exports.chatList = async (req, res) => {
	let result;
	const user = res.locals.user;
	const product = await Product.find(
		{
			sellerunique: user._id,
		},
		{ _id: 1, sellerunique: 1, onsale: 1, nickname: 1, soldBy: 1, soldById: 1 }
	);
	console.log(user);
	res.send({ product });
};

//구매자, 판매자의 닉네임
//유저의 objectId
//
