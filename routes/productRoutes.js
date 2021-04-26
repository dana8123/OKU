// 상품관련 API
const express = require("express");
const productRouter = express.Router();
const { upload } = require("../controllers/usercontroller");

// 잘연결됐는지 확인
productRouter.get("/test", test);

productRouter.get("/", upload);

module.exports = productRouter;
