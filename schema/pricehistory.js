const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const priceHistory = new Schema({
	// userId: {
	// 	type: String,
	// },
	// productId: String,
	// currentPrice: {
	// 	type: Number,
	// },
	// createAt: {
	// 	type: Date,
	// 	default: Date.now(),
	// },
	productId: Object,
	info: {
		userId: String,
		bid: Number,
	},
});

module.exports = mongoose.model("PrieceHistory", priceHistory);
