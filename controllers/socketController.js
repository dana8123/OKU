// 소켓 리스트 관련
const Product = require("../schema/product");
const PriceHistory = require("../schema/pricehistory");
const User = require("../schema/user");
const ChatRoom = require("../schema/chatroom");
const Like = require("../schema/like");
const Alert = require("../schema/alert");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");

// exports.bid = async (req, res) => {
// 	const { params: id } = req;
// 	let result;
// 	try {
// 		const { bid } = req.body;
// 		const product = Product.findById(id);
// 		//const pricehistory = priceHistory.findOne({ productId: id });
//     const recentPrice = Pricehistory.aggregate([
      
//     ])
// 		//입찰 시 시작가보다 낮거나 같을 때
// 		if (product.lowbid >= bid) {
// 			result = false;
// 			return res.status(403).send({ result });
// 		}
// 		//입찰 시 이전 입찰가보다 낮거나 같을 때
// 		if ( pricehistory.currentPrice && product.currentPrice )
// 	} catch (error) {
//         pass
//     }
// };

// 즉시 낙찰 후 프론트에선 reload해주면됨
exports.sucbid = async(req,res)=>{
	const user = res.locals.user;
    const productId = req.params;
    const {sucbid,sellerunique} = req.body;

    console.log(user["_id"],productId["id"]);

    try {
        const one = await Product.findOneAndUpdate({_id:productId["id"]},{onSale:false});
        const two =await PriceHistory.create({userId:user["_id"],productId:productId["id"],currentPrice:sucbid});
        const three =await ChatRoom.create({productId:productId["id"],buyerId:user["_id"],sellerId:sellerunique});

        console.log(one,two,three);

        // const a = await PriceHistory.find({productId:productId["id"]});
        // console.log(a);

        // await Alert.create({alertType:"즉시낙찰",productId:productId["id"],userId});
        res.send({msg:"메인페이지로 reload합니다"});
    } catch (error) {
        res.send({msg:"즉시낙찰에 실패하였습니다."});
        
    }
}

// 바로 알림
exports.alert = async(req,res) =>{
    try {
        
    } catch (error) {
        
    }
}