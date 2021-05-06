// 소켓 리스트 관련
const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");
const User = require("../schema/user");
const Like = require("../schema/like");
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
