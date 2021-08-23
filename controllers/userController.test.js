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
