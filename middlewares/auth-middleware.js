const jwt = require("jsonwebtoken");
const User = require("../schema/user");
require("dotenv").config();

// module.exports < 이렇게 export했다가 오지게 에러나서
// 이렇게 수정함

exports.authMiddlesware = (req, res, next) => {
	try {
		const { access_token } = req.headers;
		const { email } = jwt.verify(access_token, process.env.SECRET_KEY);
		const { kakaoId } = jwt.verify(access_token, process.env.SECRET_KEY);
		console.log("====email====", email);
		console.log("====id====", kakaoId);

		/*User.findOne({ email }).then((user) => {
			res.locals.user = user;
			next();
		});
*/

		if (email != undefined) {
			User.findOne({ email }).then((user) => {
				res.locals.user = user;
				next();
			});
		} else {
			User.findOne({ kakaoId }).then((user) => {
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
