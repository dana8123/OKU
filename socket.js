//socketIo 모듈을 불러오기
const socketIo = require("socket.io");

//app.js와 websocket을 연결하는 작업
module.exports = (app) => {
	//path는 클라이언트쪽 코드와 맞춰놔야함
	const io = socketIo(app, { path: "/socket.io" });
	//app.set("io", io);
	//낙찰,입찰에는 방이 필요없으니까, 우선은 생략하겠습니다.
	const chat = io.of("/okuoku");

	io.on("connection", (socket) => {
		io.send("Hello!"); //이건 지금 제가 방금 추가한겁니다.
		console.log("chat 네임스페이스에 접속되었습니다.");
		socket.on("disconnect", () => {
			console.log("chat 네임스페이스 접속 해제");
		});
	});
};
