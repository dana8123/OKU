// 소켓관련 API
const express = require("express");
const { Router } = require("express");
const sockerRouter = express.Router();
const multer = require("multer");
const { upload } = require("../middlewares/imageupload.js");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");


const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { sucbid,alert } = require("../controllers/socketController");

// 즉시 입찰하기
sockerRouter.post("/sucbid/:id",authMiddlesware,sucbid);

// 알림
sockerRouter.post("/alert",authMiddlesware,alert);