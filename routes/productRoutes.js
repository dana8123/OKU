// 상품관련 API
const express = require("express");
const { Router } = require("express");
const productRouter = express.Router();
const multer = require("multer");
const upload = require("../middlewares/imageupload.js");
const {
	bigCate,
	smallCate,
	search,
	pick,
	gayeonpick,
} = require("../controllers/productController");
const {
	bidding,
	productpost,
	detail,
	popular,
	newone,
	test,
	deadLineList,
	relate,
	allProducts,
} = require("../controllers/postController");
const { quest, questget, answer } = require("../controllers/qnaController");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");

// 상품등록
productRouter.post("/", upload.array("img", 3), authMiddlesware, productpost);

// 상품상세보기
productRouter.get("/detail/:id", detail);

// 실시간 인기상품 리스트
// onsale 처리완료
productRouter.get("/popularlist", popular);

// 모든상품 리스트
productRouter.get("/all", allProducts);

// 최신 등록 상품 리스트
// onsale 처리완료
productRouter.get("/recentlist", newone);

// 마감임박 상품 리스트
// 이건 원래 처리되어있었음
productRouter.get("/deadline", deadLineList);

// 대분류에 따른 상품리스트
productRouter.get("/Category/:bigCategory", bigCate);
// 중분류에 따른 상품리스트
productRouter.get("/Category/:bigCategory/:smallCategory", smallCate);

// 검색
// 얘만 onsale:false도 가능
productRouter.get("/search", search);

// 찜하기
productRouter.post("/pick/:id", authMiddlesware, pick);

// 문의하기(quest) , 닉네임&프로필이미지 추가
productRouter.post("/quest/:id", authMiddlesware, quest);
productRouter.post("/answer/:id", authMiddlesware, answer);
productRouter.get("/quest/:id", questget);

// MD추천아이템
productRouter.get("/recommend", gayeonpick);

// 관련상품 조회
productRouter.get("/relate", relate);

module.exports = { productRouter };
