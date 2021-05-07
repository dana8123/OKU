const Chat = require("../schema/chathistory");
const Room = require("../schema/chatroom");

//이전에 대화했던 내역 불러오기
//뭔가 이상하니까 수정하자..
exports.chat = async (req, res) => {
	const user = res.locals.user;
	const { params: id } = req;
	try {
		const room = await Room.findById(id);
		const chats = await Chat.find({ chat: room._id }).sort("date");
		res.send({ room, chats });
	} catch (error) {
		res.send({ error });
	}
};

//소켓통신으로 받은 chat 저장하고 뿌려주기
exports.realTimeChat = async (req, res) => {
	const { params: id } = req;
	try {
		const chat = new Chat({
			chatRoom: id,
			userId,
			chathistory,
		});
		await chat.save();
		req.app.get("io").of("/chat").to(req.params.id).emit("chat", chat);
	} catch (error) {}
};
