// 상품관련 API
const express = require('express');
export const productRouter = express.Router();
const { upload } = require('../controllers/usercontroller');

// 잘연결됐는지 확인
productRouter.get("/test",test);

productRouter.get("/",upload);
