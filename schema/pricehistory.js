const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
const priceHistory = new Schema({
	productId: Object,
	seller: Object,
	userId: Object,
	nickName: String,
	bid: Number,
	soldBy: {
		type: Object,
		default: undefined,
	},
	createAt: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model("PrieceHistory", priceHistory);
