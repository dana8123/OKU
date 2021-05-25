const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const alert = new Schema({
    // 판매실패 & 판매성공(즉시낙찰에만 있는로직) > 거래완료 , 즉시낙찰&입찰실패(낙찰한사람제외다른사람),상품낙찰성공(성공한사람만),문의하기&문의답글달렸을때
    alertType:{
        type:String,
        required:true
    },
    productTitle:{
        type:String
    },
    productId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    view:{
        type:Boolean,
        default:false
    },
    creatAt:{
        type:Date,
		default: Date.now
    },
    buyerId:{
        type:String
    }
});


module.exports = mongoose.model('Alert', alert);