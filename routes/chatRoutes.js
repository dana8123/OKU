const express = require("express");
const { chatList, chatDelete } = require("../controllers/chatController");
const { authMiddlesware } = require("../middlewares/auth-middleware");
const chatRouter = express.Router();

chatRouter.get("/member", authMiddlesware, chatList);
chatRouter.delete("/exit/:id", authMiddleware, chatDelete);

module.exports = { chatRouter };
