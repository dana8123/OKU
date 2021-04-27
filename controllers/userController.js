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
		const user = await User.findOne({ userId });
		if (user) {
			return res.status(400).send({ msg: "이미 존재하는 회원입니다." });
		}
		const NewUser = new User({ ...req.body });
		//bcrypt사용하여 비밀번호를 암호화하여 저장
		bcrypt.genSalt(saltRounds, function (err, salt) {
			bcrypt.hash(NewUser.password, salt, function (err, hash) {
				NewUser.password = hash;
				NewUser.save();
			});
		});
		res.send({
			msg: "회원 가입이 완료되었습니다.",
		});
	} catch (err) {
		res.status(400).send({
			msg: "회원가입에 실패했습니다.",
		});
		console.log(err);
	}
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
			return res.set("Access-Token", token).send({
				msg: "로그인 성공...",
			});
		}
	} catch (error) {
		res.status(400).send({
			msg: "로그인 에러!??",
		});
		console.log(error);
	}
};
