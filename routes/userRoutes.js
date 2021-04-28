// 유저관련 API
const express = require("express");
const passport = require("passport");
//이부분도 제가 임의로 넣은값이니 추후 수정이 필요하면 수정해주세요.
// 이런식으로 컨트롤러 안에 사용하려는 함수들 일일히 들고와야함!
const {
	login,
	signup,
	checkId,
	checkEmail,
	checkNickname,
} = require("../controllers/userController");
const userRouter = express.Router();

//두번째 인자의 경우, 임의로 넣어놓은겁니다!
userRouter.post("/signup", signup);
userRouter.get("/signup/id/:userId", checkId);
userRouter.get("/signup/email/:email", checkEmail);
userRouter.get("/signup/nickname/:nickname", checkNickname);
userRouter.post("/login", login);

module.exports = { userRouter };
