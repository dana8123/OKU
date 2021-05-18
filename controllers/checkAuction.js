const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");

module.exports = async () => {
	console.log("checkAuction");
	try {
		const today = new Date();
		today.setDate(today.getDate());

		//낙찰자가 정해지지않은 제품들, 마감기한이 지난 제품
		const targets = await Product.find({
			soldBy: null,
			deadLine: { $lte: today },
		});
		// console.log(
		// 	"====서버가 꺼지면서 낙찰자가 안정해진 것들====",
		// 	targets.length
		// );

		targets.forEach(async (target) => {
			const success = await PriceHistory.find({
				productId: target._id,
			});
			console.log("==success==", success);
			// 입찰자가 1명 이상인 경우
			if (success.length !== 0) {
				await target.updateOne({
					$set: {
						onSale: false,
						soldBy: success[0].nickName,
						sodById: success[0].userId,
					},
				});
				//console.log("====서버가 켜지면서 낙찰자가 지정됨===", success.length);
			} else {
				// 입찰자가 없을 경우
				await target.updateOne({
					$set: {
						onSale: false,
						soldBy: "-",
						soldById: "-",
					},
				});
			}
		});
		//console.log("====서버가 켜질 때 낙찰자 없음===", targets.length);
	} catch (error) {
		console.error(error);
	}
};
