// 상품등록관련
require("dotenv").config();
const multer = require("multer");
const Product = require("../schema/product");
const User = require("../schema/user");
const QuestNanswer = require("../schema/questNanswer");
const Alert = require("../schema/alert");

//post
exports.quest = async (req, res) => {
    const user = res.locals.user;
    const { contents, sellerunique } = req.body;
    const productId = req.params;


    try {
        const a = await Product.findOne({_id:productId["id"]});
        console.log(a["title"]);

        const questId = await QuestNanswer.create({ sellerId: sellerunique, userId: user["_id"], productId: productId["id"], contents: contents});
        // 판매자한테 문의 알림띄우기
        await Alert.create({alertType:"문의",productTitle:a["title"],productId:productId["id"],userId:sellerunique});
        res.send({ okay: true , questId : questId["_id"]});
    } catch (error) {
        res.send({ okay: false });
    }
};

// post
exports.answer = async (req, res) => {
    const user = res.locals.user;
    const { sellerunique, contents } = req.body;
    const questId = req.params;


    try {

        // 주의할점 문의글 get할때 나오는 _id값을 기준으로 불러옴
        if (sellerunique == user["_id"]) {
            const a = await QuestNanswer.findOneAndUpdate({ _id: questId["id"] }, { answer: contents });
            
            const b = await Product.findOne({_id:a["productId"]});
            console.log(b["title"]);

            // 문의글 단 문의자한테 알림보내기
            await Alert.create({alertType:"문의답글",productTitle:b["title"],productId:a["id"],userId:a["userId"]});
            res.send({ okay: true });
        } else {
            res.send({ okay: false });
        }
    } catch (error) {
        res.send({ okay: false });
    }
}

// get
// for문 안쓰도록 수정
exports.questget = async (req, res) => {
    const productId = req.params;
    // console.log(productId["id"]);

    try {

        const result = [];
        const a = await QuestNanswer.find({ productId: productId["id"] }, { __v: 0 });

        // 에러난 코드
        // a.forEach(async e => {
        //     const seller = await User.findOne({ _id: e["sellerId"] }, { nickname: 1, _id: 0 });
        //     const buyer = await User.findOne({ _id: e["userId"] }, { nickname: 1, profileImg: 1 });
        //     const sellernickname = seller["nickname"]
        //     const buyernickname = buyer["nickname"];
        //     const buyerprofile = buyer["profileImg"];

        //     result.push(e, { sellernickname: sellernickname, buyernickname: buyernickname, buyerprofile: buyerprofile });

        //     console.log(result);
        // });

        for(let i=0; i < a.length; i++){
            // console.log(a[i]);

            const seller = await User.findOne({ _id: a[i]["sellerId"] }, { nickname: 1, _id: 0 });
            const buyer = await User.findOne({ _id: a[i]["userId"] }, { nickname: 1, profileImg: 1 });
            const sellernickname = seller["nickname"];
            const buyernickname = buyer["nickname"];
            const buyerprofile = buyer["profileImg"];

            // console.log(sellernickname,buyernickname,buyerprofile);

            result.push({QnA:a[i],sellernickname: sellernickname, buyernickname: buyernickname, buyerprofile: buyerprofile });
        }

        res.send({ okay: true , result:result});
    } catch (error) {
        res.send({ okay: false });
    }
};
