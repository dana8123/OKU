const mongoose = require("mongoose");
const Joi = require('joi');
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
	kakaoId: String,
});

const User = mongoose.model('User',user)

const validateUser = (user) => {
	const schema = Joi.object({
		email: Joi.string().email(),
		password: Joi.string().pattern(new RegExp('^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,15}$')),
		password2: Joi.ref('password'),
		nickname: Joi.string().pattern(new RegExp('^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣a-zA-Z0-9]{1,10}$'))
	})
	
	return schema.validate(user)
}

module.exports = { User, validateUser };
