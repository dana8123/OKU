const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");
const Alert = require("../schema/alert");
const { User } = require("../schema/user");

module.exports = async () => {
	try {
		// 오늘날짜
		const today = new Date();
		today.setDate(today.getDate());

		// 낙찰자가 정해지지않은 제품들(targets), 마감기한이 지난 제품
		const targets = await Product.find({
			soldById: null,
			deadLine: { $lte: today },
		});
		// pricehistory에서 낙찰자가 정해지지않은 제품의 productId(success)
		targets.forEach(async (target) => {
			const success = await PriceHistory.find({
				productId: target._id,
			});

			// 입찰자가 1명 이상인 경우
			if (success.length !== 0) {
				// product 업데이트
				await target.updateOne({
					$set: {
						onSale: false,
						soldBy: success[0].nickName,
						soldById: success[0].userId,
					},
				});

				// 낙찰 성공자에게 알림
				await Alert.create({
					userId: success[0].userId,
					alertType: "낙찰성공",
					productTitle: target["title"],
					productId: target["_id"],
				});

				// 낙찰성공유저제외 history에 있는 이전 유저들
				const pricehistory = await PriceHistory.find(
					{
						$and: [
							{ productId: target._id },
							{ userId: { $ne: targets[0].userId } },
						],
					},
					{ userId: 1, _id: 0 }
				);

				//낙찰 실패자에게 알림
				await Alert.insertMany(
					pricehistory.map((user) => ({
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
						soldBy: undefined,
						soldById: undefined,
					},
				});
				// 판매자에게 알림
				// TODO: newproduct 수정필요
				await Alert.create({
					alertType: "판매실패",
					productTitle: target["title"],
					productId: target["_id"],
					userId: user.id,
				});
			}
		});

		//console.log("====서버가 켜질 때 낙찰자 없음===", targets.length);
	} catch (error) {
		console.error(error);
	}
};
