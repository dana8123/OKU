const Chat = require("../schema/chathistory");
const Room = require("../schema/chatroom");

//이전에 대화했던 내역 불러오기
exports.chat = async (req, res) => {
	const user = res.locals.user;
  const { params: id } = req;
	try {
    const room = await Room.findById(id);
    const chats = await Chat.find({chatRoom}).sort('date');
		});
		res.send("ok");
	} catch (error) {
		res.send({ error });
	}
};
