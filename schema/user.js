const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const user = new Schema({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	number: {
		type: String,
	},
	address: {
		type: String,
	},
	detailaddress: {
		type: String,
	},
	nickname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
	},
	profileImg: {
		type: String,
		default: "public/profile.png",
	},
});

module.exports = mongoose.model("User", user);
