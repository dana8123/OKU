const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const user = new Schema({
	email: {
		type: String,
	},
	password: {
		type: String,
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
	},
	marketdesc: {
		type: String,
		default: "",
	},
});

module.exports = mongoose.model("User", user);
