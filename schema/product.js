const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const product = new Schema({
	title: {
		type: String,
		required: true,
	},
	img: {
		type: Array,
		required: true,
	},
	nickname: {
		type: String,
		required: true,
	},
	lowBid: {
		type: Number,
		required: true,
	},
	sucBid: {
		type: Number,
		required: true,
	},
	state: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	tag: {
		type: Array,
	},
	bigCategory: {
		type: String,
		required: true,
	},
	smallCategory: {
		type: String,
		required: true,
	},
	region: {
		type: String,
	},
	deliveryPrice: {
		type: Number,
	},
	deadLine: {
		type: Number,
	},
	views: {
		type: Number,
		default: 0,
	},
	createAt: {
		type: String,
		default: Date.now,
	}
});

module.exports = mongoose.model("Product", product);
