const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const chatHistory = new Schema({
	room: {
		type: String,
		required: true,
	},
	chat: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

// [{a:"보이시나요"},{b:"아무래도그런편이죠"}]
// 실제로 소켓 구현할때 좀 변할수도있음

module.exports = mongoose.model("ChatHistory", chatHistory);
