const userRoutes = require("./userRoutes");
const app = require("../app");
const supertest = require("supertest");

test("/user/kakao 는 post 메서드를 반환하고, status code 200을 반환한다.", async () => {
	const res = await supertest(app).post("/user/kakao");
	expect(res.status).toEqual(200);
});
