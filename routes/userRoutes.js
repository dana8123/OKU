// 유저관련 API
const express = require("express");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const { upload } = require("../middlewares/imageupload.js");
const {
	login,
	signup,
	checkId,
	checkEmail,
	checkNickname,
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
const passport = require("passport");
const userRouter = express.Router();

//jwt 로그인
userRouter.post("/signup", signup);
userRouter.get("/signup/email/:email", checkEmail);
userRouter.get("/signup/nickname/:nickname", checkNickname);
userRouter.post("/login", login);
//passport 소셜로그인
userRouter.get("/kakao", passport.authenticate("kakao"));
//kakao call back
userRouter.get(
	"/kakao/oauth",
	//error 발생 시 "/"로 redirect
	passport.authenticate("kakao", { failureRedirect: "/", session: false }),
	(req, res) => {
		console.log("====user====", res);
		res.redirect("http://13.124.55.186/");
	}
);

// 내가 찜한것 불러오기
userRouter.get("/pick", authMiddlesware, pick);
// 내가 찜한것 삭제하기
userRouter.delete("/pick/:id", authMiddlesware, pickdelete);

// 내 상품목록 불러오기
userRouter.get("/myproduct", authMiddlesware, myproduct);

// 프로필 닉네임 이미지
userRouter.get("/mypronick", authMiddlesware, mypronick);
// 프로필 닉네임 수정
userRouter.put(
	"/mypronick",
	upload.array("img", 1),
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
