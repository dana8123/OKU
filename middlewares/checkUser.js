// user 회원가입 이메일, 닉네임 중복 확인
exports.checkEmail = async (req, res) => {
	const { params: email } = req;
	const user = await User.findOne(email);
	if (user) {
		res.send(false);
		return;
	}
	res.send(true);
};

exports.checkNickname = async (req, res) => {
	const { params: nickname } = req;
	const user = await User.findOne(nickname);
	if (user) {
		res.send(false);
		return;
	}
	res.send(true);
};
