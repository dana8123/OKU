const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const user = new Schema({
	u_id: {
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
	nickname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
	},
	profileImg: {
		type: String,
		required: true,
		default: "에뎨뎯",
	},
});

module.exports = mongoose.model("User", user);
