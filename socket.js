//socketIo 모듈을 불러오기
const SocketIO = require("socket.io");

//app.js와 websocket을 연결하는 작업
module.exports = (server, app) => {
	//path는 클라이언트쪽 코드와 맞춰놔야함(현재입력값이 디폴트값임.)
	const io = SocketIO(server, { path: "/socket.io" });
	app.set("io", io);
	//namespace 지정

	//server-side
	io.on("connection", (socket) => {
		socket.emit("bid", "500원");
		socket.on("bidfromClient", (data) => {
			console.log(data);
		});
		console.log(socket.id, "접속");
	});
};
