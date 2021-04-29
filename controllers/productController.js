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
	console.log(req.query["term"]);
	try {
		const product = await Product.find({});
		res.send({okay:true,result:product});
	} catch (error) {
		res.send({okay:false});
	}
};