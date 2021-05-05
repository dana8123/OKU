// 유저관련 API
const express = require("express");
const passport = require("passport");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");

const {
	login,
	signup,
	checkId,
	checkEmail,
	checkNickname,
	pick,
	pickdelete,
	myproduct,
	mypronick
} = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.get("/signup/email/:email", checkEmail);
userRouter.get("/signup/nickname/:nickname", checkNickname);
userRouter.post("/login", login);

// 내가 찜한것 불러오기
userRouter.get("/pick", authMiddlesware,pick);
// 내가 찜한것 삭제하기
userRouter.delete("/pick/:id",authMiddlesware,pickdelete);

// 내 상품목록 불러오기
userRouter.get("/myproduct",authMiddlesware,myproduct);

// 프로필 닉네임 이미지
// userRouter.get("/mypronick",authMiddlesware,mypronick);
// userRouter.put("/mypronick",authMiddlesware,mypronickedit);


module.exports = { userRouter };
