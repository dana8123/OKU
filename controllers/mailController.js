module.exports = async () => {
	const PriceHistory = require("../schema/pricehistory");
	const nodemailer = require("../nodemailer");
	try {
		const notYetMailing = await PriceHistory.find({
			mailing: false,
			checkOrder: true,
		});
		//배열의 요소를 순회하기위한 for..of
		for (let recipient of notYetMailing) {
			const user = recipient.userEmail;
			const subject = "낙찰 성공!";
			console.log(user + "에게 낙찰성공 메일 보냄");
			nodemailer(user, subject);
			await recipient.updateOne({
				mailing: true,
			});
		}
	} catch (error) {
		console.log(error);
	}
};
