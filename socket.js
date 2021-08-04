const SocketIO = require("socket.io");
const http = require("./app");
const io = SocketIO(http, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const chatSpace = io.of("/chat");
const globalSpace = io.of("/global");

chatSpace.on("connection", (socket) => {
	const { watchJoin, watchSend, watchByebye } = initSocket(socket);

	watchJoin();
	watchSend();
	watchByebye();
});

const initSocket = (socket) => {
	console.log("새로운 소켓이 연결되었습니다.");
	function watchEvent(event, func) {
		socket.on(event, func);
	}

	function notifyToChat(event, data) {
		console.log("데이터를 emit합니다.");
		chatSpace.emit(event, data);
	}

	function notifyToRoom(event, data) {
		console.log("room에 emit합니다.");
		const { room } = data;
		chatSpace.to(room).emit(event, data);
	}
	return {
		// 특정 room에 join
		watchJoin: () => {
			watchEvent("join", async (data) => {
				const Chat = require("./schema/chathistory");
				const { room } = data;
				socket.join(room);
				const chats = await Chat.find({ room });
				console.log("Hello watchJoin!");
				console.log(socket.rooms.size);
				notifyToChat("load", chats);
			});
		},

		// send a message
		watchSend: () => {
			watchEvent("send", async (data) => {
				const Chat = require("./schema/chathistory");
				const { room } = data;
				const content = new Chat({
					room,
					productId: data.product,
					msg: data.msg,
					user: data.username,
					time: Date.now(),
				});
				await content.save();
				notifyToChat("receive", content);
			});
		},

		// room leave
		watchByebye: () => {
			watchEvent("disconnect", () => {
				console.log("chatSpace 접속 해제");
				// room leave가 성공적으로 되었을 때 아래 콘솔 값 === 0
				console.log(socket.rooms.size);
			});
		},
	};
};
