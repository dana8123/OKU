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
