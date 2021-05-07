// 소켓 리스트 관련
const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");
const ChatRoom = require("../schema/chatroom");
const User = require("../schema/user");
const Like = require("../schema/like");
const Alert = require("../schema/alert");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");
const pricehistory = require("../schema/pricehistory");
const product = require("../schema/product");

exports.bid = async (req, res) => {
    const user = res.locals.user;
    const { id } = req.params;
    try {
        let result = true;
        const { bid } = req.body;
        const product = await Product.findById(id);
        const bidList = await PriceHistory.find({ productId: id });
        const nickName = user["nickname"]
        //console.log(bidList);
        //console.log("===두번째디버깅===", price);

        const lowBid = await product.lowBid;
        console.log("시작가", lowBid);

        //입찰 시 시작가보다 낮거나 같을 때
        if (lowBid >= bid) {
            result = "lowBid";
            return res.status(403).send({ result });
        }
        //경매 기간이 지났을 경우
        let now = new Date();
        if (product.deadLine < now) {
            result = "time";
            return res.status(403).send({ result });
        }
        //입찰 시 이전 입찰가보다 낮거나 같을 때
        if (bidList[0] && bidList[bidList.length - 1].bid >= bid) {
            result = "before";
            return res.status(403).send({ result });
        }
        //TODO: 입찰하기에서 즉시 입찰가 혹은 그 이상을 입력했을 때
        console.log(product.sucBid);
        if (bid >= product.sucBid) {
            result = await pricehistory.create({
                userId: user["_id"],
                bid,
                productId: id,
            });
            return res.send({ result: "마감" });
        }
        result = await pricehistory.create({
            userId: user["_id"],
            bid,
            productId: id,
            nickName: nickName
        });
        res.send({ result });
    } catch (error) {
        console.error(error);
        res.send({ error });
    }
};


exports.sucbid = async (req, res) => {
    const user = res.locals.user;
    const productId = req.params;
    const { sucbid, sellerunique } = req.body;

    // console.log(user["_id"], productId["id"]);
    // console.log(sucbid,sellerunique);

    try {
        try {
            const pro = await Product.findOneAndUpdate({ _id: productId["id"] }, { onSale: false });
        } catch (error) {
            res.send({ msg: "제품이 존재하지 않습니다." })
        }

        try {
            await PriceHistory.create({ productId: productId["id"], userId: user["_id"], bid: sucbid, nickName: user["nickname"] });
        } catch (error) {
            res.send({ msg: "낙찰 기록에 실패했습니다." })
        }

        try {
            await ChatRoom.create({
                productId: productId["id"],
                buyerId: user["_id"],
                sellerId: sellerunique,
            });
        } catch (error) {
            res.send({ msg: "채팅방 생성에 실패했습니다." })
        }

        try {
            // 즉시낙찰유저제외 history에있는 모든 유저 불러오기
            const a = await PriceHistory.find({ $and: [{ productId: productId["id"] }, { userId: { $ne: user["_id"] } }] }, { userId: 1, _id: 0 });

            await Alert.insertMany(a.map((user) => ({
                alertType: "낙찰실패",
                productId: productId["id"],
                userId: user.userId,
            })));
        } catch (error) {
            res.send(error)
        }

        try {
            // 상품 낙찰 성공 알람 보내기
            await Alert.create({ userId: user["_id"], alertType: "낙찰성공", productId: productId["id"] });

        } catch (error) {
            res.send({ msg: "즉시 낙찰자에게 낙찰실패알림" })
        }

        res.send({ msg: "메인페이지로 reload합니다" });
    } catch (error) {
        console.log(error);
        res.send({ msg: "즉시낙찰에 실패하였습니다." });
    }
};
// 바로 알림
exports.alert = async (req, res) => {
    const user = res.locals.user;

    try {
        const notCheck = await Alert.find({ userId: user["_id"], view: false });
        const alreadyCheck = await Alert.find({ userId: user["_id"], view: true });

        await Alert.updateMany({ userId: user["_id"], view: false }, { $set: { view: true } });

        res.send({ okay: true, notCheck: notCheck, alreadyCheck: alreadyCheck });
    } catch (error) {
        res.sned({ okay: false })
    }
};

// 이전 입찰정보 불러오기
exports.bidinfo = async (req, res) => {
    const productId = req.params;

    try {
        const info = await PriceHistory.find({ productId: productId["id"] }, { nickName: 1, bid: 1, createAt: 1, _id: 0 })

        if (info.length < 1) {
            res.send({ okay: true, msg: "현재입찰자가 없습니다." })
        } else {
            res.send({ okay: true, prebid: info });
        }
    } catch (error) {
        res.send({ okay: false })
    }
}