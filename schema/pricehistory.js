const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
const priceHistory = new Schema({
	productId: Object,
	userId: Object,
	nickName:String,
	bid: Number,
	createAt: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model("PrieceHistory", priceHistory);