const User = require("../schema/user");
const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;
const { kakaoLoginCallback } = require("../controllers/userController");

passport.use(
	new kakaoStrategy(
		{
			//kakao에서 제공하는 restAPI
			clientID: process.env.kakao,
			callbackURL: "http://" + process.env.DB_SERVER + "/user/kakao/oauth",
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
		}
	)
);
