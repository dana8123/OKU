// 소켓관련 API
const express = require("express");
const { bid } = require("../controllers/socketController");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");

const socketRouter = express.Router();

socketRouter.post("/:id", authMiddlesware, bid);

module.exports = { socketRouter };
