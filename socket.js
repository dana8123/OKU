//socketIo 모듈을 불러오기
const SocketIO = require("socket.io");

//app.js와 websocket을 연결하는 작업
module.exports = (server, app) => {
	//path는 클라이언트쪽 코드와 맞춰놔야함(현재입력값이 디폴트값임.)
	const io = SocketIO(server, { path: "/socket.io" });
	app.set("io", io);
	//namespace 지정
	const bid = io.of("/bid");

	//server-side
	bid.on("connection", (socket) => {
		socket.on("order:list", () => {
			console.log("orderlist event");
		});
		socket.emit("hello", "하하하");
		console.log("order 네임스페이스에 접속!");
	});
};
