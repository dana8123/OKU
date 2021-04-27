// 상품 리스트 관련
const Product = require("../schema/product");
const user = require("../schema/user");

exports.bigCate = async (req, res) => {
	const {bigCate} = req.params;
	console.log(bigCate);

	try {
		const a = await Product.find({});

	} catch (error) {
		
	}
};

exports.smallCate = async (req, res) => {
	try {
		
	} catch (error) {
		
	}
};

