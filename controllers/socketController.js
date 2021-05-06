// 소켓 리스트 관련
const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");
const User = require("../schema/user");
const Like = require("../schema/like");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");

exports.bid = async (req, res) => {
	const { params: id } = req;
	let result;
	try {
		const { bid } = req.body;
		const product = Product.findById(id);
		//const pricehistory = priceHistory.findOne({ productId: id });
    const recentPrice = Pricehistory.aggregate([
      
    ])
		//입찰 시 시작가보다 낮거나 같을 때
		if (product.lowbid >= bid) {
			result = false;
			return res.status(403).send({ result });
		}
		//입찰 시 이전 입찰가보다 낮거나 같을 때
		if ( pricehistory.currentPrice && product.currentPrice )
	} catch (error) {}
};
