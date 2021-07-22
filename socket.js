//socketIo 모듈을 불러오기
const SocketIO = require("socket.io");
const Chat = require("./schema/chathistory");

//TODO: productID 보내주기

//app.js와 websocket을 연결하는 작업
module.exports = (server, app) => {
	//path는 클라이언트쪽 코드와 맞춰놔야함(현재입력값이 디폴트값임.)
	const io = SocketIO(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	const chatSpace = io.of("/chat");
	const globalSpace = io.of("/global");

	//logic
	chatSpace.on("connection", async (socket) => {
		// user join
		socket.on("join", async (data) => {
			const req = socket.request;
			const { room, username } = data;
			socket.join(room); //특정 방에 접속하는 코드
			const chats = await Chat.find({ room });
			chatSpace.to(room).emit("load", chats);
		});
		// send message
		socket.on("send", async (data) => {
			const { room } = data;
			const content = new Chat({
				room,
				productId: data.product,
				msg: data.msg,
				user: data.username,
				time: Date.now(),
			});
			if (data.room === `${undefined}-${undefined}-${undefined}`) {
				content.msg = "거래 이후 채팅 가능합니다.";
			} else {
				await content.save();
			}
			// 저장한 데이터를 클라이언트에게 receive라는 emit으로 전송
			chatSpace.to(room).emit("receive", content);
			//접속해제 시 방을 떠나는 코드
			socket.on("disconnect", () => {
				console.log("chat 네임스페이스 접속 해제");
				socket.leave(room);
			});
		});
	});

	//global socket 알림, 채팅 목록
	globalSpace.on("connection", function (socket) {
		socket.on("globalSend", async function (data) {
			console.log(data);
			globalSpace.emit("globalReceive", data);
		});
	});
};
