require("dotenv").config();

// 회원가입 API
exports.signup = async (req, res) => {
	const bcrypt = require("bcrypt");
	const { password, password2, nickname, email } = req.body;
	const saltRounds = 10;
	const { User } = require("../schema/user");
	const checkEmail = await User.findOne({ email });
	const checkNickname = await User.findOne({ nickname });
	let result = { msg: { dupMsg: false } };

	try {
		//userEmail 중복 여부 체크
		if (checkEmail) {
			throw (result.msg.dupMsg = "email False");
		}

		if (password != password2) {
			throw (result.msg.dupMsg = "pwFalse");
		}

		//usernickname 중복 여부 체크
		if (checkNickname) {
			throw (result.msg.dupMsg = "nicknameFalse");
		}

		const NewUser = new User({ ...req.body });
		//bcrypt사용하여 비밀번호를 암호화하여 저장
		bcrypt.genSalt(saltRounds, function (err, salt) {
			bcrypt.hash(NewUser.password, salt, function (err, hash) {
				NewUser.password = hash;
				NewUser.save();
			});
		});
		result.msg.dupMsg = true;
		res.send(result);
	} catch (error) {
		res.status(400).send(result);
		console.log(error);
	}
};

//Login API
exports.login = async (req, res) => {
	const bcrypt = require("bcrypt");
	const { email, password } = req.body;
	const jwt = require("jsonwebtoken");
	const { User } = require("../schema/user");
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
	const { User } = require("../schema/user");
	const {
		_json: { id, properties, kakao_account },
	} = profile;
	try {
		const user = await User.findOne({ kakaoId: id });
		if (user) {
			console.log("유저프로퍼티", profile);
			return done(null, user);
		}
		console.log("passport======>", id);
		const newUser = await User.create({
			kakaoId: id,
			email: kakao_account.email,
			nickname: properties.nickname,
		});
		await newUser.save();
		return done(null, newUser);
	} catch (error) {
		return done(error);
	}
};

//카카오 토큰 보내주기
exports.kakaoLogin = async (req, res) => {
	const { kakaoId } = req.body;
	const jwt = require("jsonwebtoken");
	const { User } = require("../schema/user");
	const user = await User.findOne({ kakaoId });
	const nickname = user.nickname;
	const token = jwt.sign(
		{ kakaoId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
		process.env.SECRET_KEY
	);
	//console.log("postkakao", kakaoId);
	res.send({ access_token: token, userid: user._id, nickname });
};

//찜한 상품
exports.pick = async (req, res) => {
	const Like = require("../schema/like");
	const Product = require("../schema/product");
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
	const Like = require("../schema/like");
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
	const Product = require("../schema/product");
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
	const { User } = require("../schema/user");
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

// 마이페이지 내 정보 API
exports.myinfo = async (req, res) => {
	const user = res.locals.user;
	try {
		res.send({ okay: true, user });
	} catch (error) {
		res.send({ okay: false });
	}
};

// 마이페이지 상점 정보
exports.marketadd = async (req, res) => {
	const content = req.body.content;
	const { User } = require("../schema/user");
	const user = res.locals.user;

	try {
		await User.findByIdAndUpdate({ _id: user.id }, { marketdesc: content });
		res.send({ okay: true });
	} catch (error) {
		res.send({ okay: false });
	}
};

// 마이페이지 상점 정보
exports.marketshow = async (req, res) => {
	const { User } = require("../schema/user");
	const user = res.locals.user;

	try {
		const marketdesc = await User.findOne({ _id: user.id }, { marketdesc: 1 });
		res.send({ okay: true, marketdesc: marketdesc });
	} catch (error) {
		res.send({ okay: false });
	}
};
