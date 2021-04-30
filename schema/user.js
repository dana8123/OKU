const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const user = new Schema({
	email: {
		type: String,
	},
	password: {
		type: String,
		required: true,
	},
	number: {
		type: String,
	},
	nickname: {
		type: String,
		required: true,
	},
	profileImg: {
		type: String,
		default: "public/profile.png",
	},
});

module.exports = mongoose.model("User", user);
