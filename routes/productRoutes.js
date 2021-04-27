// 상품관련 API
const { Router } = require("express");
const express = require("express");
const productRouter = express.Router();
const multer = require('multer');
const { bigCate,smallCate } = require("../controllers/productController");
const { bidding,productpost,test } = require("../controllers/postcontroller");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const { upload } = require("../middlewares/imageupload.js");

// 이미지 등록용 테스트
productRouter.post("/test",upload,test)

// 상품등록
productRouter.post("/",productpost);

// 상품입찰
productRouter.post("/auction",authMiddlesware,bidding);

// 대분류에 따른 상품리스트
productRouter.get("/product/:bigCategory",bigCate);

// 중분류에 따른 상품리스트
productRouter.get("/product/:bigCategory/:smallCategory",smallCate);


module.exports = { productRouter };
