const { User } = require("../schema/user");
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
		kakaoLoginCallback
	)
);
