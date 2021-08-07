const jwt = require("jsonwebtoken");
const { User } = require("../schema/user");
require("dotenv").config();

exports.authMiddlesware = (req, res, next) => {
	try {
		const { access_token } = req.headers;
		const { email } = jwt.verify(access_token, process.env.SECRET_KEY);
		const { kakaoId } = jwt.verify(access_token, process.env.SECRET_KEY);

		if (email != undefined) {
			User.findOne(email).then((user) => {
				res.locals.user = user;
				next();
			});
		} else {
			User.findOne(kakaoId).then((user) => {
				res.locals.user = user;
				next();
			});
		}
	} catch (error) {
		res.json({
			msg: "not_login",
		});
		return;
	}
};
