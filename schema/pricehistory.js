const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
const priceHistory = new Schema({
	productId: {
		type: String,
		required: true,
	},
	userId: {
		type: Object,
		required: true,
	},
	nickName: {
		type: String,
		required: true,
	},
	bid: {
		type: Number,
		required: true,
	},
	createAt: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model("PrieceHistory", priceHistory);
