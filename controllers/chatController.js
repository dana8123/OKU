const Chat = require("../schema/chathistory");
const Room = require("../schema/chatroom");
const PriceHistory = require("../schema/pricehistory");
const Product = require("../schema/product");
const User = require("../schema/user");

//채팅목록에서 뿌려줄 채팅 리스트
exports.chatList = async (req, res) => {
	const user = res.locals.user;
	//const product = await Product.find(
	// 	{
	// 		sellerunique: user._id,
	// 	},
	// 	{ _id: 1, sellerunique: 1, onsale: 1, nickname: 1, soldBy: 1, soldById: 1 }
	// );
	let targets = [];
	const product = await Product.find({});
	// IF 문을 사용해 고르기...
	for (let i = 0; i < product.length; i++) {
		if (product[i].soldById == user._id) {
			targets.push(product[i]);
		}
		if (product[i].sellerunique == user._id) {
			targets.push(product[i]);
		}
	}
	res.send({ targets });
	// TODO: onsale == false일 때 추가하기
	// console.log("===로그인한 유저===", user.nickname);
	// console.log("===target===", targets);
};

//구매자, 판매자의 닉네임
//유저의 objectId
//
