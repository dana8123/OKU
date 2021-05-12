const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");

module.exports = async () => {
	console.log("checkAuction");
	try {
		const today = new Date();
		today.setDate(today.getDate());

		//낙찰자가 정해지지않은 제품들, TODO: 마감기한이 지난 제품만 고를것
		const targets = await Product.find({ soldBy: null });
		targets.forEach(async (target) => {
			const success = await PriceHistory.find({
				productId: target._id,
			});
			if (success.length !== 0) {
				await target.updateOne({
					$set: {
						onSale: false,
						soldBy: success[0].nickName,
						sodById: success[0].userId,
					},
				});
			} else {
				await target.updateOne({
					$set: {
						onSale: false,
						soldBy: null,
						soldById: null,
					},
				});
			}
		});
	} catch (error) {
		console.error(error);
	}
};