// 상품등록관련
require('dotenv').config();
const user = require("../schema/user");
const Product = require("../schema/product");
// const user = require("../schema/user");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const { upload } = require("../middlewares/imageupload.js");

exports.test = async (req, res) => {
    let image = '';
    if (req["file"]) {
        images = req.file.filename
        image = `http://localhost:9090/` + req.file.filename
    }

    try {

        res.send("콘솔로그확인")
    } catch (error) {
        res.send(error)
    }
}

exports.productpost = async (req, res) => {
    // 로그인기능 구현되고나서 라우트에 미들웨어 붙이기
    // const user = res.locals.user;
    // 이미지도 나중에
    const {
        title,
        img,
        nickname,
        lowbid,
        sucbid,
        state,
        description,
        tag,
        bigCategory,
        smallCategory,
        region,
        deliveryprice,
        deadline
    } = req.body;

    try {
        await Product.create({
            title: title,
            img: img,
            nickname: nickname,
            lowBid: lowbid,
            sucBid: sucbid,
            state: state,
            description: description,
            tag: tag,
            bigCategory: bigCategory,
            smallCategory: smallCategory,
            region: region,
            deliveryPrice: deliveryprice,
            deadLine: deadline
        });

        res.send({ msg: "상품이 등록되었습니다" });
    } catch (error) {
        res.send({ msg: "상품이 등록에 실패하였습니다." });
    }
}

exports.bidding = async (req, res) => {
    // const user = res.locals.user;
    try {

    } catch (error) {

    }
}