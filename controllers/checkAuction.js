const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");

module.exports = async () => {
	console.log("checkAuction");
	try {
		const today = new Date();
		today.setDate(today.getDate());

		//낙찰자가 정해지지않은 제품들, TODO: 마감기한이 지난 제품만 고를것
		const targets = await Product.find({
			soldBy: null,
			deadLine: { $lte: today },
		});
		console.log(targets);
		targets.forEach(async (target) => {
			const success = await PriceHistory.find({
				productId: target._id,
			});
			// 입찰자가 1명 이상인 경우
			if (success.length !== 0) {
				await target.updateOne({
					$set: {
						onSale: false,
						soldBy: success[0].nickName,
						sodById: success[0].userId,
					},
				});
			} else {
				// 입찰자가 없을 경우
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
