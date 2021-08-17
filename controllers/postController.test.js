const httpMocks = require("node-mocks-http");
const postController = require("./postController");
const Product = require("../schema/product");
const newProduct = require("../test/data/new-product");
const user = require("../test/data/user");
const { authMiddleware } = require("../middlewares/auth-middleware");

Product.create = jest.fn();

let req, res, next;

beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
	next = jest.fn();
});

test("productpost function이 실행되어야한다.", () => {
	expect(typeof postController.productpost).toBe("function");
});

test("200 상태코드와 json형태로 응답해야한다.", async () => {
	Product.create.mockReturnValue(newProduct);
	res.locals.user = jest.fn();
	await postController.productpost(req, res, next);

	expect(res.statusCode).toBe(200);
	expect(res._isEndCalled()).toBeTruthy();
	expect(res._getJSONData()).toStrictEqual(newProduct);
});

test("에러를 핸들링한다.", async () => {
	res.locals.user = jest.fn();
	const err = { msg: "error!" };
	const rejectPromise = Promise.reject(err);
	Product.create.mockReturnValue(rejectPromise);
	await postController.productpost(req, res, next);
	expect(next).toBeCalled();
});
