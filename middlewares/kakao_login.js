const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;
const User = require("../schema/user");

passport.use(
	"kakao",
	new kakaoStrategy(
		{
			//kakao에서 제공하는 restAPI
			clientID: `8a922b1e5e141ebd833f748407727429`,
			callbackURL: `http://localhost:3000/oauth`,
		},
		async (accessToken, refreshToken, profile, done) => {
			//사용자의 정보는 procile에 들어있다.
			console.log(accessToken, profile);
			await User.create({ ...profile });
			if (err) {
				return done(err);
			}
			return done(null, user);
		}
	)
);
