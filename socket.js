//socketIo 모듈을 불러오기
module.exports = (server) => {
	const SocketIO = require("socket.io");
	const Chat = require("./schema/chathistory");
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
			}
			//챗봇
			else if (data.product === "1") {
				if (data.msg.includes("사용법")) {
					content.msg =
						"오타쿠 굿즈를 판매하고싶다면, \n왼쪽 상단의 물건등록을 눌러주세요.\n 구매하려면 경매물품을 최고가에 입찰해봅시다!";
				}
				if (data.msg.includes("신고")) {
					content.msg =
						"현재 신고관련 기능은 준비중입니다. \n경매 물건의 이름과 신고대상의 닉네임을\n itsoku@naver.com 으로 보내주시면 확인 후 블락하고있습니다.";
				}
				if (data.msg.includes("개발자")) {
					content.msg =
						"저희에게 관심이 있으시다구요?! https://www.notion.so/90bbb2e5d07941a3a46370e5333c7556";
				}
				if (data.msg.includes("건의")) {
					content.msg =
						"어떤점이 불편하셨나요? itsoku@naver.com 으로 보내주시면 귀담아 듣겠습니다.";
				}
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
