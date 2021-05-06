const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const priceHistory = new Schema({
	userId: {
		type: String,
	},
	productId: {
		type: ObjectId(),
	},
	currentPrice: {
		type: Number,
	},
	createAt: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("PrieceHistory", priceHistory);
