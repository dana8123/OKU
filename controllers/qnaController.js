// 상품등록관련
require("dotenv").config();
const multer = require("multer");
const Product = require("../schema/product");
const User = require("../schema/user");
const jwt = require("jsonwebtoken");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const { upload } = require("../middlewares/imageupload.js");

//post
exports.quest = async(req,res)=>{
	const user = res.locals.user;
    const {sellerId,contents} = req.body;
    const {productId} = req.params;
    console.log(user);
    console.log(req.body);
    console.log(productId);
    try {
        res.send({okay:true});
    } catch (error) {
        res.send({okay:false});
    }
};

//get
exports.questget = async(req,res)=>{

    try {
        
    } catch (error) {
        
    }
};