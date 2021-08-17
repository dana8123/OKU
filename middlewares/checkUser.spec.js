const { checkEmailForClient } = require("./checkUser");
jest.mock("../schema/user");

const { User } = require("../schema/user");

test("이메일을 입력하면 findOne이 실행된다.", () => {
	User.findOne = jest.fn();

	checkEmailForClient(
		{
			params: "sample@test.com",
		},
		{
			send: () => {},
		}
	);

	expect(User.findOne).toHaveBeenCalled();
	expect(User.findOne).toHaveBeenCalledWith("sample@test.com");
});

// 아래 테스트가 자꾸 실패하는 이유..?
test("중복되지 않은 이메일을 입력하면 true를 반환한다.", async () => {
	const mockedJson = await jest.fn();
	checkEmailForClient(
		{
			email: "sample02@naver.com",
		},
		{
			json: mockedJson,
		}
	);

	expect(mockedJson).toHaveBeenCalledWith({ result: true });
});
