// 상품관련 API
const express = require("express");
const { Router } = require("express");
const productRouter = express.Router();
const multer = require("multer");
const { upload } = require("../middlewares/imageupload.js");
const { bigCate, smallCate } = require("../controllers/productController");
const { bidding, productpost, detail } = require("../controllers/postController");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");

// 테스트용 api
// productRouter.post("/test", authMiddlesware, test);

// 상품등록
// 미들웨어 붙이고 로그인처리 필요
productRouter.post("/", upload.single("img"), productpost);

// 상품상세보기
productRouter.get("/:id",detail);

// 상품 입찰
productRouter.post("/auction", authMiddlesware, bidding);
// 상품 즉시 낙찰
productRouter.post("/auction", authMiddlesware, bidding);

// 대분류에 따른 상품리스트
productRouter.get("/product/:bigCategory", bigCate);

// 중분류에 따른 상품리스트
productRouter.get("/product/:bigCategory/:smallCategory", smallCate);

module.exports = { productRouter };
