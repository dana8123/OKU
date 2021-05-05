const express = require("express");

const chatRouter = express.Router();

chatRouter.get("/", (req, res) => {
	res.send("쏘켓..쏘켓..하고 쏘켓새가 울었다..");
});

module.exports = { chatRouter };
