// 유저정보
//로직 짤 때 필요한 디비 등등 불러서 바로 쓰시면 됩니다.
const passport = require("passport");
const User = require("../schema/user");
const Product = require("../schema/product");
const Like = require("../schema/like");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const product = require("../schema/product");
const saltRounds = 10;

exports.signup = async (req, res) => {
	const {
		userId,
		password,
		password2,
		number,
		nickname,
		email,
		profileImg,
	} = req.body;

	//TODO: validation data

	//javascript dotdotdot 이렇게 검색하면 나와요!
	try {
		const checkId = await User.findOne({ userId });
		//userId 중복 여부 체크
		if (checkId) {
			return res.send({
				msg: {
					dupMsg: "IdFalse",
				},
			});
		}

		if (password != password2) {
			return res.send({
				msg: {
					dupMsg: "pwFalse",
				},
			});
		}

		const checkNickname = await User.findOne({ nickname });
		//usernickname 중복 여부 체크
		if (checkNickname) {
			return res.send({
				msg: {
					dupMsg: "nicknameFalse",
				},
			});
		}

		const checkEmail = await User.findOne({ email });
		//userEmail 중복 여부 체크
		if (checkEmail) {
			return res.send({
				msg: {
					dupMsg: "emailFalse",
				},
			});
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
			msg: {
				dupMsg: true,
			},
		});
	} catch (err) {
		res.status(400).send({
			msg: "회원가입에 실패했습니다.",
		});
		console.log(err);
	}
};

exports.checkId = async (req, res) => {
	const { params: userId } = req;
	const user = await User.findOne(userId);
	if (user) {
		res.send({ result: false });
		return;
	}
	res.send({ result: true });
};

exports.checkEmail = async (req, res) => {
	const { params: email } = req;
	const user = await User.findOne(email);
	if (user) {
		res.send({ result: false });
		return;
	}
	res.send({ result: true });
};

exports.checkNickname = async (req, res) => {
	const { params: nickname } = req;
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
				msg: "userId False",
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
		res.send({
			msg: "password False",
		});
	} catch (error) {
		res.status(400).send({
			msg: "로그인 에러",
		});
		console.log(error);
	}
};

exports.pick = async(req,res)=>{
	const user = res.locals.user;
	try {
		const product = await Like.find({userId:user["_id"]},{_id:0 ,productId:1,productImage:1});
		res.send({okay:true,reulst:product});
	} catch (error) {
		res.send({okay:false})
	}
}