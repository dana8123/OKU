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
	const { password, password2, number, nickname, email, profileImg } = req.body;

	//TODO: validation data

	//javascript dotdotdot 이렇게 검색하면 나와요!
	try {
		const checkEmail = await User.findOne({ email });
		const checkNickname = await User.findOne({ nickname });

		//userEmail 중복 여부 체크
		if (checkEmail) {
			return res.send({
				msg: {
					dupMsg: "emailFalse",
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

		//usernickname 중복 여부 체크
		if (checkNickname) {
			return res.send({
				msg: {
					dupMsg: "nicknameFalse",
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

//Login
exports.login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	try {
		if (user == null) {
			return res.status(400).send({
				msg: "eamil False",
			});
		}
		const match = await bcrypt.compare(password, user.password);
		if (match) {
			const token = jwt.sign({ email }, process.env.SECRET_KEY);
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
		res.send({okay:true,result:product});
	} catch (error) {
		res.send({okay:false})
	}
}

exports.pickdelete = async(req,res)=>{
	const user = res.locals.user;
	const productId = req.params;
	try {
		const product = await Like.deleteOne({userId:user["_id"],productId:productId["id"]});
		console.log(product);
		res.send({okay:true});
	} catch (error) {
		res.send({okay:false});
	}
}