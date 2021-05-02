// 상품 리스트 관련
const Product = require("../schema/product");
const User = require("../schema/user");
const Like = require("../schema/like");
const { authMiddlesware } = require("../middlewares/auth-middleware.js");

exports.bigCate = async (req, res) => {
	const { bigCategory } = req.params;
	console.log(bigCategory);

	try {
		const product = await Product.find({ bigCategory: bigCategory });
		res.send({okay:true,result:product});
	} catch (error) {
		res.send({okay:false});
	}
};

exports.smallCate = async (req, res) => {
	const { bigCategory, smallCategory } = req.params;
	console.log(bigCategory, smallCategory);
	try {
		const product = await Product.find({ bigCategory: bigCategory, smallCategory: smallCategory });
		res.send({okay:true,result:product});
	} catch (error) {
		res.send({okay:false});
	}
};

exports.search = async(req,res)=>{
	console.log(req.query);
	try {
		const a = req.query["term"]
		const product = await Product.find({$or:[{tag:new RegExp(a)},{title:new RegExp(a)}]},{__v:0});
		console.log(product);
		res.send({okay:true,result:product});
	} catch (error) {
		res.send({okay:false});
	}
};

exports.pick = async(req,res)=>{
	const user = res.locals.user;
	const productId = req.params;
	const product = await Product.find({_id:productId["id"]},{img:1,sellerunique:1});

	try {
		await Like.create({
			userId:user["_id"],
			productId :productId["id"],
			productImage:product[0]["img"][0],
			sellerId:product[0]["sellerunique"]
		});
		res.send({msg:"찜이 등록되었습니다."});
	} catch (error) {
		res.send({msg:"찜에 실패하였습니다."});
	}
};

exports.gayeonpick = async(req,res)=>{
	try {
		
	} catch (error) {
		
	}
}