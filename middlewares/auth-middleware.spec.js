const { authMiddlesware } = require("./auth-middleware");
jest.mock("../schema/user");

const { User } = require("../schema/user");

test("정상적인 토큰을 넣은 경우 User.findOne이 실행된다.", () => {
	User.findOne = jest.fn();

	authMiddlesware(
		{
			headers: {
				access_token:
					"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJzYW1wbGUiLCJpYXQiOjE1MTYyMzkwMjJ9.C-GELIUg65fKPFyHbZkq5phaj9Kh2YKRAzEsk4iFD3E",
			},
		},
		{
			locals: {},
			json: () => {},
		}
	);

	expect(User.findOne).toHaveBeenCalledTimes(1);
	expect(User.findOne).toHaveBeenCalledWith("sample");
});

test("변조된 토큰으로 요청한 경우, not_login이라는 에러 메시지가 뜬다.", () => {
	const mockedJson = jest.fn();

	authMiddlesware(
		{
			headers: {
				access_token:
					"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cq-uoLxOu3V4RjxnbUAFZ36aSZ24BXiAH8RFDYVA6XU",
			},
		},
		{
			locals: {},
			json: mockedJson,
		}
	);

	expect(mockedJson).toHaveBeenCalledWith({
		msg: "not_login",
	});
});
