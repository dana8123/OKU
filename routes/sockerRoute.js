const express = require("express");
// 소켓관련 API
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const { sucbid, alert ,bid, bidinfo } = require("../controllers/socketController");

const socketRouter = express.Router();

// 입찰하기
socketRouter.post("/bidtry/:id", authMiddlesware, bid);
// 즉시 낙찰하기
socketRouter.post("/sucbid/:id", authMiddlesware, sucbid);

// 알림
socketRouter.get("/alert", authMiddlesware, alert);

// 이전입찰정보 불러오기
socketRouter.get("/bidinfo/:id",bidinfo);

module.exports = { socketRouter };
