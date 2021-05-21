const express = require("express");
// 소켓관련 API
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const { sucbid, alert ,bid, bidinfo,salecheck,newsucbid,buyerCheck,sellerSelct } = require("../controllers/socketController");

const socketRouter = express.Router();

// 입찰하기
socketRouter.post("/bidtry/:id", authMiddlesware, bid);

// 즉시 낙찰하기
socketRouter.post("/sucbid/:id", authMiddlesware, sucbid);

///////////////////////////////////

// 즉시 낙찰하기
socketRouter.post("/newsucbid/:id", authMiddlesware, newsucbid);

// 판매자가 유저정보 조회
socketRouter.get("/buyercheck/:id",authMiddlesware,buyerCheck);

// 유저정보에 따라 거래진행 선택여부
socketRouter.post("/sellerconfirm/:id",authMiddlesware,sellerSelct);

//////////////////////////////////

// 알림
socketRouter.get("/alert", authMiddlesware, alert);

// 이전입찰정보 불러오기
socketRouter.get("/bidinfo/:id",bidinfo);

module.exports = { socketRouter };
