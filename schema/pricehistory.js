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
	userEmail: {
		type: String,
	},
	bid: {
		type: Number,
		required: true,
	},
	mailing: {
		type: Boolean,
		default: false,
	},
	checkOrder: {
		type: Boolean,
		default: false,
	},
	createAt: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model("PrieceHistory", priceHistory);
