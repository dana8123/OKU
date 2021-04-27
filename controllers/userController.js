// 유저정보
//로직 짤 때 필요한 디비 등등 불러서 바로 쓰시면 됩니다.
const passport = require("passport");
const User = require("../schema/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.signup = async (req, res) => {
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
		const user = await User.findOne({ email });
		//userEmail 중복 여부 체크
		// if (user) {
		// 	return res.status(400).send({
		// 		result: false,
		// 	});
		// }
		const NewUser = new User({ ...req.body });
		//bcrypt사용하여 비밀번호를 암호화하여 저장
		bcrypt.genSalt(saltRounds, function (err, salt) {
			bcrypt.hash(NewUser.password, salt, function (err, hash) {
				NewUser.password = hash;
				NewUser.save();
			});
		});
		res.send({
			result: true,
		});
	} catch (err) {
		res.status(400).send({
			msg: "회원가입에 실패했습니다.",
		});
		console.log(err);
	}
};

exports.checkId = async (req, res) => {
	const { body: userId } = req;
	const user = await User.findOne(userId);
	if (user) {
		res.send({ result: false });
		return;
	}
	res.send({ result: true });
};

exports.checkEmail = async (req, res) => {
	const { body: email } = req;
	const user = await User.findOne(email);
	if (user) {
		res.send({ result: false });
		return;
	}
	res.send({ result: true });
};

exports.checkEmail = async (req, res) => {
	const { body: email } = req;
	const user = await User.findOne(email);
	if (user) {
		res.send({ result: false });
		return;
	}
	res.send({ result: true });
};

exports.checkNickname = async (req, res) => {
	const { body: nickname } = req;
	const user = await User.findOne(nickname);
	if (user) {
		res.send({ result: false });
		return;
	}
	res.send({ result: true });
};

// exports.passportRegister = async (req, res) => {
// 	const {
// 		userId,
// 		password,
// 		number,
// 		address,
// 		nickname,
// 		email,
// 		profileImg,
// 	} = req.body;

// 	User.register(new User({ ...req.body }), (err, user) => {
// 		if (err) {
// 			return res.status(400).send({
// 				msg: "passport error",
// 			});
// 			console.log(err);
// 		}
// 		passport.authenticate("local")(req, res, () => {
// 			req.session.save((err) => {
// 				if (err) {
// 					return next(err);
// 				}
// 				res.send({ msg: "인증에러!" });
// 			});
// 		});
// 	});
// };

exports.login = async (req, res) => {
	const { userId, password } = req.body;
	const user = await User.findOne({ userId });
	try {
		if (user == null) {
			return res.status(400).send({
				msg: "이메일 혹은 비밀번호가 일치하지 않습니다.",
			});
		}
		const match = await bcrypt.compare(password, user.password);
		if (match) {
			const token = jwt.sign({ userId }, process.env.SECRET_KEY);
			return res.send({
				access_token: token,
				nickname: user.nickname,
			});
		}
	} catch (error) {
		res.status(400).send({
			msg: "로그인 에러!??",
		});
		console.log(error);
	}
};
