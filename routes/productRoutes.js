// 상품관련 API
const { Router } = require("express");
const express = require("express");
const productRouter = express.Router();
const multer = require("multer");
const { bigCate, smallCate } = require("../controllers/productController");
const { bidding, productpost, test } = require("../controllers/postController");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const { upload } = require("../middlewares/imageupload.js");

<<<<<<< HEAD
// 테스트용 api
productRouter.post("/test", authMiddlesware,test)

// 상품등록
// 미들웨어 붙이고 로그인처리 필요
productRouter.post("/",productpost);

// 상품 입찰
productRouter.post("/auction",authMiddlesware,bidding);
// 상품 즉시 낙찰
productRouter.post("/auction",authMiddlesware,bidding);

=======
// 이미지 등록용 테스트
//productRouter.post("/test",upload,test)

// 상품등록
productRouter.post("/", productpost);

// 상품입찰
productRouter.post("/auction", authMiddlesware, bidding);
>>>>>>> 626520987b6c9f8589c3eb92109ce92c7c982584

// 대분류에 따른 상품리스트
productRouter.get("/product/:bigCategory", bigCate);

// 중분류에 따른 상품리스트
productRouter.get("/product/:bigCategory/:smallCategory", smallCate);

module.exports = { productRouter };
