const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");
const Alert = require("../schema/alert");

module.exports = async () => {
	try {
		const today = new Date();
		today.setDate(today.getDate());

		//낙찰자가 정해지지않은 제품들, 마감기한이 지난 제품
		const targets = await Product.find({
			soldBy: null,
			deadLine: { $lte: today },
		});

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
				// 낙찰 성공자에게 알림
				await Alert.create({
					userId: pricehistory[0].userId,
					alertType: "낙찰성공",
					productTitle: newProduct["title"],
					productId: newProduct["_id"],
				});

				// 낙찰성공유저제외 history에 있는 이전 유저들
				const a = await PriceHistory.find(
					{
						$and: [
							{ productId: newProduct._id },
							{ userId: { $ne: pricehistory[0].userId } },
						],
					},
					{ userId: 1, _id: 0 }
				);

				//낙찰 실패자에게 알림
				await Alert.insertMany(
					a.map((user) => ({
						alertType: "낙찰실패",
						productId: newProduct["_id"],
						productTitle: newProduct["title"],
						userId: user.userId,
					}))
				);
			} else {
				// 입찰자가 없을 경우
				// 낙찰자 미지정('-')
				await target.updateOne({
					$set: {
						onSale: false,
						soldBy: "-",
						soldById: "-",
					},
				});
				// 판매자에게 알림
				await Alert.create({
					alertType: "판매실패",
					productTitle: newProduct["title"],
					productId: newProduct["_id"],
					userId: user.id,
				});
			}
		});
		//console.log("====서버가 켜질 때 낙찰자 없음===", targets.length);
	} catch (error) {
		console.error(error);
	}
};
