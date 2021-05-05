// 상품등록관련
require("dotenv").config();
const multer = require("multer");
const Product = require("../schema/product");
const User = require("../schema/user");
const QuestNanswer = require("../schema/questNanswer");

//post
exports.quest = async (req, res) => {
    const user = res.locals.user;
    const { contents } = req.body;
    const productId = req.params;

    console.log(user["_id"],productId["id"],req.body);

    try {
        await QuestNanswer.create({ userId: user["_id"], productId: productId["id"], contents: contents , answer:" " });
        res.send({ okay: true });
    } catch (error) {
        res.send({ okay: false });
    }
};

// post
exports.answer = async (req, res) => {
    const user = res.locals.user;
    const { sellerunique, contents } = req.body;
    const questId = req.params;

    console.log(user["_id"],sellerunique,contents,questId["id"]);

    try {
        if (sellerunique == user["_id"]) {
            const a = await QuestNanswer.findOneAndUpdate({_id:questId["id"]},{answer: contents });
            console.log(a);
            res.send({ okay: true });
        } else {
            res.send({ okay: false });
        }
    } catch (error) {
        res.send({ okay: false });
    }
}

//get
exports.questget = async (req, res) => {
    const productId = req.params;
    console.log(productId["id"]);
    try {
        const a = await QuestNanswer.find({ productId: productId["id"]},{__v:0,userId:0,_id:0});
        console.log(a);
        res.send({ okay: true, result: a });
    } catch (error) {
        res.send({ okay: false });
    }
};
