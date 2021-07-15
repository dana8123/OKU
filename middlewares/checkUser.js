// 클라이언트 화면 확인용, user 회원가입 이메일, 닉네임 중복 확인, 파라미터 필요.

exports.checkEmail = async (req, res) => {
	const { params: email } = req;
	const { User } = require("../schema/user");
	const user = await User.findOne(email);
	if (user) {
		res.send({ result: false });
		return;
	}
	res.send({ result: true });
};

exports.checkNickname = async (req, res) => {
	const { params: nickname } = req;
	const { User } = require("../schema/user");
	const user = await User.findOne(nickname);
	if (user) {
		res.send({ result: false });
		return;
	}
	res.send({ result: true });
};
