//socketIo 모듈을 불러오기
const SocketIO = require("socket.io");

//app.js와 websocket을 연결하는 작업
module.exports = (server, app) => {
	//path는 클라이언트쪽 코드와 맞춰놔야함(현재입력값이 디폴트값임.)
	const io = SocketIO(server, { path: "/socket.io" });
	app.set("io", io);
	//namespace 지정

	//server-side
	io.of("/chat").on("connection", (socket) => {
		const req = socket.request;
		console.log("chat 네임스페이스 접속");
		//클라이언트에게 주는 정보
		socket.emit("join", {
			user: "system",
			message: `${socket.id}님이 입장하셨습니다.`,
		});
		io.emit("messageFromClient", "안녕하세요");
		//클라이언트로부터 받는 정보
		socket.on("bidfromClient", (data) => {
			console.log(data);
		});

		// 즉시낙찰
		// 받아야하는 데이터 token,sucbid,productId
		// 데이터를 받은뒤에 저장하고 그 뒤에 상품판매종료로 product state를 바꾸고
		// 로그인 인증 미들웨어 어떻게 붙이지..
		socket.on("immebid", (data) => {
			data.gayeon;
			data.token; // 여기서 미들웨어로 작업
			const req = data.request;
			const {} = req;
		});
	});
};
