// 유저정보
//로직 짤 때 필요한 디비 등등 불러서 바로 쓰시면 됩니다.
const passport = require("passport");
const User = require("../schema/user");
const Product = require("../schema/product");
const Like = require("../schema/like");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const product = require("../schema/product");
const saltRounds = 10;
const request = require("request");
require("dotenv").config();

// 연재님 업데이트 안되시나요

exports.signup = async (req, res) => {
	const { password, password2, nickname, email } = req.body;

	//TODO: validation data

	try {
		const checkEmail = await User.findOne({ email });
		const checkNickname = await User.findOne({ nickname });

		//userEmail 중복 여부 체크
		if (checkEmail) {
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
				msg: "email False",
			});
		}
		const match = await bcrypt.compare(password, user.password);
		if (match) {
			const token = jwt.sign({ email }, process.env.SECRET_KEY);
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
	const token = jwt.sign({ kakaoId }, process.env.SECRET_KEY);
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
	console.log(user["profileImg"], user["nickname"]);
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
	const image = req.file;
	console.log("===image===", req.file);
	try {
		// 프로필이미지가 넘어오지않을때의 예외처리
		if (image == undefined) {
			const newinfo = await User.findOneAndUpdate(
				{ _id: user["_id"] },
				{ nickname: nick }
			);
			res.send({
				okay: true,
				profileImg: newinfo["profileImg"],
				nickname: newinfo["nickname"],
			});
		} else {
			const newinfo = await User.findOneAndUpdate(
				{ _id: user["_id"] },
				{ nickname: nick, profileImg: image.location }
			);
			res.send({
				okay: true,
				profileImg: newinfo["profileImg"],
				nickname: newinfo["nickname"],
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

exports.numberconfirm = async (req, res) => {
	const phoneNumber = req.body.phoneNumber;
	console.log(phoneNumber);
	const NCP_secretKey = process.env.SMSseceretKey;
	const NCP_accessKey = process.env.SMSaccesskey;
	const NCP_serviceID = process.env.SMSserviceId;
	const myPhoneNumber = process.env.myPhoneNumber;

	const space = " "; // one space
	const newLine = "\n"; // new line
	const method = "POST"; // method

	const url = `https://sens.apigw.ntruss.com/sms/v2/services/${NCP_serviceID}/messages`;
	const url2 = `/sms/v2/services/${NCP_serviceID}/messages`;

	const timestamp = Date.now().toString(); // current timestamp (epoch)
	let message = [];
	let hmac = crypto.createHmac("sha256", NCP_secretKey);

	message.push(method);
	message.push(space);
	message.push(url2);
	message.push(newLine);
	message.push(timestamp);
	message.push(newLine);
	message.push(NCP_accessKey);
	const signature = hmac.update(message.join("")).digest("base64");

	const number = Math.floor(Math.random() * (999999 - 100000)) + 100000;
	console.log(number);

	try {
		request({
			method: method,
			json: true,
			uri: url,
			headers: {
				"Contenc-type": "application/json; charset=utf-8",
				"x-ncp-iam-access-key": NCP_accessKey,
				"x-ncp-apigw-timestamp": timestamp,
				"x-ncp-apigw-signature-v2": signature.toString(),
			},
			body: {
				type: "SMS",
				countryCode: "82",
				from: myPhoneNumber,
				content: ` OKU 인증번호 ${number} 입니다.`,
				messages: [
					{
						to: `${phoneNumber}`,
					},
				],
			},
		});

		res.send({ okay: true });
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
