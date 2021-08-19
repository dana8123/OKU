const httpMocks = require("node-mocks-http");
const postController = require("./postController");
const Product = require("../schema/product");
const newProduct = require("../test/data/new-product");
const newUser = require("../test/data/user.json");
const allProducts = require("../test/data/all-products.json");
const { User } = require("../schema/user");

Product.create = jest.fn();
Product.find = jest.fn();
Product.sort = jest.fn();
Product.limit = jest.fn();
Product.findOneAndUpdate = jest.fn();
User.findOne = jest.fn();

let req, res, next;

beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
	next = jest.fn();
});

describe("postController, productpost", () => {
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
		const err = { msg: "title is required" };
		const rejectPromise = Promise.reject(err);
		Product.create.mockReturnValue(rejectPromise);
		await postController.productpost(req, res, next);
		expect(next).toBeCalledWith(err);
	});
});

describe("productController, newone", () => {
	test("newone function이 실행되어야한다.", () => {
		expect(typeof postController.newone).toBe("function");
	});

	test("Product.find({onSale:true})를 실행시켜야한다.", async () => {
		await postController.newone(req, res, next);
		expect(Product.find).toHaveBeenCalledWith({ onSale: true });
	});

	test("성공할 경우, {okay : true, productList : {}}의 형식으로 응답한다.", async () => {
		Product.find.mockReturnValue(newProduct);

		await postController.newone(req, res, next);
		expect(res._getData()).toStrictEqual({
			okay: true,
			productList: allProducts,
		});
	});
});

describe("postController, detail", () => {
	test("detail함수가 실행되어야한다.", () => {
		expect(typeof postController.detail).toBe("function");
	});
	test("Product.findOneAndUpdate가 실행되어야한다.", async () => {
		await postController.detail(req, res);
		expect(Product.findOneAndUpdate).toHaveBeenCalled();
	});

	test("Product를 게시한 user에 대해 User.findOne이 실행되어야한다.", async () => {
		Product.findOneAndUpdate.mockReturnValue(newProduct);
		await postController.detail(req, res);
		expect(User.findOne).toHaveBeenCalled();
	});

	test("{okay: true, result: {}, seller,{} }의 형태로 응답한다.", async () => {
		Product.findOneAndUpdate.mockReturnValue(newProduct);
		User.findOne.mockReturnValue(newUser);
		await postController.detail(req, res);
		expect(res._getData()).toStrictEqual({
			okay: true,
			result: newProduct,
			seller: newUser,
		});
		expect(res._isEndCalled);
	});

	test("실패할 경우, {okay: false}의 형태로 응답하고, Error를 핸들링한다.", async () => {
		const err = { msg: "no product information" };
		const rejectPromise = Promise.reject(err);
		Product.findOneAndUpdate.mockReturnValue(rejectPromise);
		await postController.detail(req, res, next);
		expect(res._getData()).toStrictEqual({ okay: false });
		expect(next).toBeCalledWith(err);
	});
});
