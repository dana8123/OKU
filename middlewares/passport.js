const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;
const kakaoLoginCallback = require("../controllers/userController");
const User = require("../schema/user");

passport.use(
	new kakaoStrategy(
		{
			//kakao에서 제공하는 restAPI
			//TODO: .env로 옮기자.
			clientID: process.env.kakao,
			callbackURL: `http://localhost:3000/oauth`,
		},
		kakaoLoginCallback
	)
);
