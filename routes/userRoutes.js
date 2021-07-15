// 유저관련 API
const express = require("express");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const upload = require("../middlewares/imageupload.js");
const {
	login,
	signup,
	checkId,
	kakaoLogin,
	pick,
	pickdelete,
	myproduct,
	mypronick,
	mypronickedit,
	myinfo,
	numberconfirm,
	marketadd,
	marketshow,
} = require("../controllers/userController");
const { checkEmail, checkNickname } = require("../middlewares/checkUser");
const passport = require("passport");
const { validateUser } = require("../schema/user");
const validateMiddleware = require("../middlewares/validateMiddleware");
const userRouter = express.Router();

//jwt 로그인
userRouter.post("/signup", [validateMiddleware(validateUser)], signup);
userRouter.get("/signup/email/:email", checkEmail);
userRouter.get("/signup/nickname/:nickname", checkNickname);
userRouter.post("/login", login);
//passport 소셜로그인
userRouter.get("/kakao", passport.authenticate("kakao"));
//kakao call back
//user id 보내주기
userRouter.get("/kakao/oauth", (req, res) => {
	passport.authenticate("kakao", { failureRedirect: "/" }, (err, user) => {
		const { kakaoId } = user;
		return res.redirect("http://myoku.co.kr/social/" + kakaoId);
	})(req, res);
});

//kakao 토큰 생성
userRouter.post("/kakao", kakaoLogin);

//kakao accessToken 보내주기
userRouter.post("/kakao", passport.authenticate("kakao"), kakaoLogin);
// 내가 찜한것 불러오기
userRouter.get("/pick", authMiddlesware, pick);
// 내가 찜한것 삭제하기
userRouter.delete("/pick/:id", authMiddlesware, pickdelete);

// 내 상품목록 불러오기
userRouter.get("/myproduct", authMiddlesware, myproduct);

// 프로필 닉네임 이미지
userRouter.get("/mypronick", authMiddlesware, mypronick);
// 프로필 닉네임 수정
// INFO: 1장만 받아도 되는 곳이라 array => single로 수정
userRouter.put(
	"/mypronick",
	upload.single("profileImg"),
	authMiddlesware,
	mypronickedit
);

// 내 정보 조회
userRouter.get("/myinfo", authMiddlesware, myinfo);

// 전화번호
userRouter.post("/numberconfirm", numberconfirm);

// 상점소개 수정
userRouter.put("/marketdesc", authMiddlesware, marketadd);
// 상점소개 조회
userRouter.get("/marketdesc", authMiddlesware, marketshow);

module.exports = { userRouter };
