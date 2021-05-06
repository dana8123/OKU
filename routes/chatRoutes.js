const express = require("express");

const chatRouter = express.Router();

chatRouter.get("/", (req, res) => {
	res.render("index");
});

module.exports = { chatRouter };
