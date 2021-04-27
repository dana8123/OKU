// 유저관련 API
const express = require("express");
//이부분도 제가 임의로 넣은값이니 추후 수정이 필요하면 수정해주세요.
// 이런식으로 컨트롤러 안에 사용하려는 함수들 일일히 들고와야함!
const { login, register } = require("../controllers/usercontroller");
const userRouter = express.Router();

//두번째 인자의 경우, 임의로 넣어놓은겁니다!
userRouter.get("/login", login);
userRouter.post("/register", register);

module.exports = { userRouter };
