const { User } = require("../schema/user");
const Product = require("../schema/product");
const Like = require("../schema/like");
require("dotenv").config();

exports.signup = async (req, res) => {
	const bcrypt = require("bcrypt");
	const { checkEmail, checkNickname } = require("../middlewares/checkUser");
	const { password, password2, nickname, email } = req.body;
	const saltRounds = 10;
	try {
		//userEmail 중복 여부 체크
		if (checkEmail == false) {
			return res.send({
				msg: {
					dupMsg: "email False",
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
		if (checkNickname == false) {
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

//Login
exports.login = async (req, res) => {
	const bcrypt = require("bcrypt");
	const { email, password } = req.body;
	const jwt = require("jsonwebtoken");
	const user = await User.findOne({ email });
	try {
		if (user == null) {
			return res.status(400).send({
				msg: "email False",
			});
		}
		const match = await bcrypt.compare(password, user.password);
		if (match) {
			const token = jwt.sign(
				{ email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
				process.env.SECRET_KEY
			);
			return res.send({
				access_token: token,
				nickname: user.nickname,
				userId: user._id,
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

//kakao callback
exports.kakaoLoginCallback = async (
	accessToken,
	refreshToken,
	profile,
	done
) => {
	console.log(accessToken, refreshToken, profile, done);
	console.log("kakao!");
	res.send({ profile });
};

//카카오 토큰 보내주기
exports.kakaoLogin = async (req, res) => {
	//id = kakaoId, TODO: kakao ID로 바꾸자고 성목님한테 말하기(반응형 끝나고)
	const { kakaoId } = req.body;
	const user = await User.findOne({ kakaoId });
	const nickname = user.nickname;
	const token = jwt.sign(
		{ kakaoId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
		process.env.SECRET_KEY
	);
	console.log("postkakao", kakaoId);
	//userid -> kakao id로 바꾸기(프론트와 협의 필요 )
	res.send({ access_token: token, userid: user._id, nickname });
};

exports.pick = async (req, res) => {
	const user = res.locals.user;

	// 타이틀이랑 현재입찰가까지 넘겨주기

	try {
		const like = [];

		const product = await Like.find(
			{ userId: user["_id"] },
			{ _id: 0, productId: 1, productImage: 1 }
		);

		const title = await Product.find(
			{ _id: user._id }
			//product.map((user) => ({ _id: user["_id"] }))
		);

		res.send({ okay: true, result: product });
	} catch (error) {
		res.send({ okay: false, error });
		console.log(error);
	}
};

exports.pickdelete = async (req, res) => {
	const user = res.locals.user;
	const productId = req.params;
	try {
		const product = await Like.deleteOne({
			userId: user["_id"],
			productId: productId["id"],
		});
		console.log(product);
		res.send({ okay: true });
	} catch (error) {
		res.send({ okay: false });
	}
};

exports.myproduct = async (req, res) => {
	const user = res.locals.user;

	try {
		const product = await Product.find({ sellerunique: user["_id"] });
		res.send({ okay: true, result: product });
	} catch (error) {
		res.send({ okay: false });
	}
};

exports.mypronick = async (req, res) => {
	const user = res.locals.user;
	try {
		res.send({
			okay: true,
			nickname: user["nickname"],
			profile: user["profileImg"],
		});
	} catch (error) {
		res.send({ okay: false });
	}
};

exports.mypronickedit = async (req, res) => {
	const user = res.locals.user;
	const { nick } = req.body;
	// INFO : profile img = 1 ea 라서 array -> string 으로 수정
	const image = req.file.location;

	try {
		// 프로필이미지가 넘어오지않을때의 예외처리
		if (image == undefined) {
			const newinfo = await User.updateOne(
				{ _id: user._id },
				{ nickname: nick }
			);
			return res.send({
				okay: true,
				profileImg: newinfo["profileImg"],
				nickname: newinfo["nickname"],
			});
			// 프로필 이미지를 넘겨줄 때의 처리
		} else {
			console.log("프로필이미지수정", image);
			console.log("프로필이미지수정", nick);
			const newinfo = await User.updateOne(
				{ _id: user._id },
				{ nickname: nick, profileImg: image }
			);
			return res.send({
				okay: true,
				profileImg: newinfo.procileImg,
				nickname: newinfo.nickname,
			});
		}
	} catch (error) {
		res.send({ okay: false });
	}
};

exports.myinfo = async (req, res) => {
	const user = res.locals.user;
	try {
		res.send({ okay: true, user });
	} catch (error) {
		res.send({ okay: false });
	}
};

exports.marketadd = async (req, res) => {
	const content = req.body.content;
	const user = res.locals.user;

	try {
		await User.findByIdAndUpdate({ _id: user.id }, { marketdesc: content });
		res.send({ okay: true });
	} catch (error) {
		res.send({ okay: false });
	}
};

exports.marketshow = async (req, res) => {
	const user = res.locals.user;

	try {
		const marketdesc = await User.findOne({ _id: user.id }, { marketdesc: 1 });
		res.send({ okay: true, marketdesc: marketdesc });
	} catch (error) {
		res.send({ okay: false });
	}
};
