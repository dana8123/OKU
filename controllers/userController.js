// 유저정보
//로직 짤 때 필요한 디비 등등 불러서 바로 쓰시면 됩니다.
const User = require("../schema/user");

exports.register = async (req, res) => {
	const {
		userId,
		password,
		number,
		address,
		nickname,
		email,
		profileImg,
	} = req.body;

	//TODO: validation data

	//javascript dotdotdot 이렇게 검색하면 나와요!
	try {
		const user = await User.findOne({ userId });
		if (user) {
			return res.status(400).send({ msg: "이미 존재하는 회원입니다." });
		}
		const NewUser = new User({ ...req.body });
		await NewUser.save();
		res.send({
			msg: "회원가입 성공!",
		});
	} catch (err) {
		res.status(400).send({
			msg: "회원가입에 실패했습니다.",
		});
		console.log(err);
	}
};
