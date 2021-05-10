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
	sellerunique: {
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
		type: Boolean,
	},
	deadLine: {
		type: Date,
		required: true,
	},
	views: {
		type: Number,
		default: 0,
	},
	onSale: {
		type: Boolean,
		default: true,
	},
	//낙찰자의 닉네임
	soldBy: {
		type: String,
	},
	//낙찰자의 objectId
	soldById: {
		type: String,
	},
	createAt: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model("Product", product);
