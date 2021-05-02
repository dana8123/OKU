// 상품등록관련
require("dotenv").config();
const multer = require("multer");
const Product = require("../schema/product");
const User = require("../schema/user");
const Quest = require("../schema/quest");
const Answer = require("../schema/answer");
const jwt = require("jsonwebtoken");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const { upload } = require("../middlewares/imageupload.js");

//post
exports.quest = async (req, res) => {
    const user = res.locals.user;
    const { sellerId, contents } = req.body;
    const productId = req.params;

    try {
        await Quest.create({ userId: user["_id"], productId: productId["id"], contents: contents });
        res.send({ okay: true });
    } catch (error) {
        res.send({ okay: false });
    }
};

//get
exports.questget = async (req, res) => {
    const productId = req.params;
    try {
        const quest = await Quest.find({ productId: productId["id"] }, { __v: 0 });
        res.send({ okay: true, result: quest });
    } catch (error) {
        res.send({ okay: false });
    }
};

// post
exports.answer = async (req, res) => {
    const user = res.locals.user;
    const questId = req.params;
    const { sellerunique, contents } = req.body;

    try {
        if (sellerunique == user["_id"]) {
            await Answer.create({ userId: user["_id"], questId: questId["id"], contents: contents });
            res.send({ okay: true });
        } else {
            res.send({ okay: false });
        }
    } catch (error) {
        res.send({ okay: false });
    }
}

// get
exports.answerget = async (req, res) => {
    const questId = req.params;
    try {
        const answer = await Answer.find({ questId: questId["id"] });
        res.send({ okay: true, result: answer });
    } catch (error) {
        res.send({ okay: false });
    }
}