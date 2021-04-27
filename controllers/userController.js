// 유저정보
//로직 짤 때 필요한 디비 등등 불러서 바로 쓰시면 됩니다.
const User = require("../schema/user");

exports.register = async (req, res) => {
	const {
		u_id,
		password,
		password2,
		number,
		address,
		nickname,
		email,
	} = req.body;
};

//TODO: validation data

const user = await User.findOne({ email });

if (user) {
	return res.status(400).send({ msg: "이미 존재하는 회원입니다." });
}
if (password !== password2) {
	return res.status(400).send({ msg: "비밀번호가 불일치합니다." });
}
//javascript dotdotdot 이렇게 검색하면 나와요!
try {
	const NewUser = new User({ ...req.body });
	await User.register();
}