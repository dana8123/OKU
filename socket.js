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

globalSpace.on("connection", (socket) => {
	const { watchGlobal } = initSocket(socket);

	watchGlobal();
});

const initSocket = (socket) => {
	console.log("새로운 소켓이 연결되었습니다.");
	function watchEvent(event, func) {
		socket.on(event, func);
	}

	function notifyToChat(event, data) {
		console.log("chatSpace 데이터를 emit합니다.");
		chatSpace.emit(event, data);
	}

	function notifyToGlobal(event, data) {
		console.log("globalSpace 데이터를 emit합니다.");
		globalSpace.emit(event, data);
	}
	return {
		// 특정 room에 join
		watchJoin: () => {
			watchEvent("join", async (data) => {
				const sizeof = require("object-sizeof");
				const Chat = require("./schema/chathistory");
				const { room } = data;
				socket.join(room);
				const chats = await Chat.find({ room }).limit(30).lean();

				console.log(sizeof(chats));

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
				//await content.save();
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

		// global space
		watchList: () => {
			watchEvent("globalSend", async (data) => {
				console.log("chat list 확인");
				notifyToGlobal("globalReceive", data);
			});
		},
	};
};
