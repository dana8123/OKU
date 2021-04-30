// 상품 리스트 관련
const Product = require("../schema/product");
const User = require("../schema/user");

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