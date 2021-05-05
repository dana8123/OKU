const socketIo = require("socket.io");


module.exports = (app) => {
  //path는 클라이언트쪽 코드와 맞춰놔야함
  const io = socketIo(app, {path: "/socket.io"});
}

//낙찰,입찰에는 방이 필요없으니까, 우선은 생략하겠습니다.
const chat = io.of('/okuoku');

chat.on("connection", (socket) => {
  console.log("chat 네임스페이스에 접속되었습니다.");
  socket.on("disconnect", () => {
    console.log("chat 네임스페이스 접속 해제");
  })
})

