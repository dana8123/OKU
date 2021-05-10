const express = require("express");
const { chatList } = require("../controllers/chatController");
const { authMiddlesware } = require("../middlewares/auth-middleware");
const chatRouter = express.Router();

chatRouter.get("/member", authMiddlesware, chatList);

module.exports = { chatRouter };
