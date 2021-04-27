// 상품관련 API
const { Router } = require("express");
const express = require("express");
const productRouter = express.Router();
const multer = require('multer');
// const { test } = require("../controllers/productController");
const { test,popo } = require("../controllers/postcontroller");
const {authMiddlesware } = require("../middlewares/auth-middleware.js");
const { upload } = require("../middlewares/imageupload.js");



productRouter.post("/",popo);

module.exports = { productRouter };
