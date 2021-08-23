const httpMocks = require("node-mocks-http");
const userController = require("./userController");
const { User } = require("../schema/user");
const newUser = require("../test/data/new-user.json");
const oldUser = require("../test/data/joined-user.json");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

User.findOne = jest.fn();
bycrypt.compare = jest.fn();
jwt.sign = jest.fn();

beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
	next = jest.fn();
});

describe("userController.signUp", () => {
	test("sigunup함수가 실행되어야한다.", () => {
		expect(typeof userController.signup).toBe("function");
	});

	test("checkEmail을 실행한다.", async () => {
		User.findOne.mockReturnValue(newUser);
		const checkEmail = jest.fn();
		await userController.signup(req, res);
		expect(typeof checkEmail).toBe("function");
	});

	test("checkEmail실행결과 이미 존재하는 회원이라면 result.msg.dupMsg = email False로 응답한다.", async () => {
		User.findOne.mockReturnValue(oldUser);
		await userController.signup(req, res);
		expect(res._getData()).toStrictEqual({ msg: { dupMsg: "email False" } });
	});

	test("올바른 회원정보라면, result.msg.dupMsg = true 로 응답한다.", async () => {
		User.findOne.mockReturnValue(null);
		await userController.signup(req, res);
		expect(res._getData()).toStrictEqual({ msg: { dupMsg: true } });
	});
});

describe("userController, login", () => {
	test("login 함수를 실행한다.", () => {
		expect(typeof userController.login).toBe("function");
	});

	test("User.findOne을 실행한다.", async () => {
		await userController.login(req, res);
		expect(User.findOne).toHaveBeenCalled();
	});

	test("올바른 로그인 정보라면, access_token,nickname,userId를 리턴한다.", async () => {
		const token =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mjk3OTMxMjMsImlhdCI6MTYyOTcwNjcyM30.UBS0aly49SBA3moJMfOOc2JqPAieLirSW6paG5ZyoTI";
		User.findOne.mockReturnValue(oldUser);
		bycrypt.compare.mockReturnValue("somthing..");
		jwt.sign.mockReturnValue(token);
		await userController.login(req, res);
		expect(res._getData()).toEqual({
			access_token: token,
			nickname: oldUser.nickname,
			userId: oldUser._id,
		});
	});

	test("없는 유저라면, msg: email False 를 리턴한다.", async () => {
		User.findOne.mockReturnValue(null);
		await userController.login(req, res);
		expect(res._getData()).toStrictEqual({ msg: "email False" });
	});

	test("비밀번호 불일치 시, msg: password False 를 리턴한다.", async () => {
		User.findOne.mockReturnValue(oldUser);
		bycrypt.compare.mockReturnValue(null);
		await userController.login(req, res);
		expect(res._getData()).toStrictEqual({ msg: "password False" });
	});
});
