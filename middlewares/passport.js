const User = require("../schema/user");
const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;
const { kakaoLoginCallback } = require("../controllers/userController");

passport.use(
	new kakaoStrategy(
		{
			//kakao에서 제공하는 restAPI
			clientID: process.env.kakao,
			callbackURL: `http://${DB_SERVER}/user/kakao/oauth`,
		},
		async (accessToken, refreshToken, profile, done) => {
			const {
				_json: { id, properties, kakao_account },
			} = profile;
			try {
				const user = await User.findOne({ kakaoId: id });
				if (user) {
					console.log("유저프로퍼티", profile);
					return done(null, user);
				}
				if (properties.nickname == "조상균") {
					console.log("불량회원", properties.nickname);
					return done(error);
				}
				if (kakaoId == "1735851486") {
					console.log("불량회원", kakaoId);
					return done(error);
				}
				const newUser = await User.create({
					kakaoId: id,
					email: kakao_account.email,
					nickname: id,
				});
				await newUser.save();
				return done(null, newUser);
			} catch (error) {
				return done(error);
			}
		}
	)
);
