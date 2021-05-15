const User = require("../schema/user");
const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;
const { kakaoLoginCallback } = require("../controllers/userController");

passport.use(
	new kakaoStrategy(
		{
			//kakao에서 제공하는 restAPI
			clientID: process.env.kakao,
			callbackURL: `http://13.124.55.186/user/kakao/oauth`,
		},
		async (accessToken, refreshToken, profile, done) => {
			console.log(profile);
			console.log("==done==", done);
			const {
				_json: { id, properties },
			} = profile;
			try {
				// const user = await User.findOne({ email });
				// if (user) {
				// 	//추가예정
				// }
				const newUser = await User.create({
					email: id,
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
