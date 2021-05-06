const app = express();
const express = require("express");
// 소켓관련 API
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { bid } = require("../controllers/socketController");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const { sucbid, alert } = require("../controllers/socketController");

const socketRouter = express.Router();

socketRouter.post("/:id", authMiddlesware, bid);

// 즉시 입찰하기
sockerRouter.post("/sucbid/:id", authMiddlesware, sucbid);

// 알림
sockerRouter.post("/alert", authMiddlesware, alert);

module.exports = { socketRouter };
