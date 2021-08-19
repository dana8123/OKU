const request = require("supertest");
const app = require("../../app");
const newProduct = require("../data/new-product.json");
const authMiddleware = require("../../middlewares/auth-middleware");

// beforeEach(() => {
// 	const response = await request(app).set(
// 		"access_token",
// 		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrYWthb0lkIjoiMTczMzA2Njc2NSIsImV4cCI6MTYyOTIwOTUyNCwiaWF0IjoxNjI5MTIzMTI0fQ._JouligAPD6w6HHfsv3OazCC-7mJL9xrOXly48FoOlc"
// 	);
// });
test("POST product/postproduct", async () => {
	const response = await request(app).post("/product/").send(newProduct);

	expect(response.statusCode).toBe(200);
	expect(response.header.access_token).toBe();
	expect(response.body).toBe(newProduct.title);
});
