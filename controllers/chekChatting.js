module.exports = async (req, res) => {
	const Chat = require("../schema/chathistory");
	try {
		const today = new Date();
		const weekAgo = today.setDate(today.getDate() - 7);
		// 채팅내역 중 생성된 지 일주일이 지난 내역 삭제하기
		const weekPass = await Chat.find({
			time: { $gte: weekAgo, $lte: today },
		});
		await weekPass.deleteMany(weekPass);
	} catch (error) {
		console.log(error);
		res.send(error);
	}
};
