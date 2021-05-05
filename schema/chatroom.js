const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const chatRoom = new Schema({
    productId:{
        type: String,
        required:true
    },
    buyerId:{
        type: String,
        required:true
    },
    sellerId:{
        type: String,
        required:true
    },
    buyerOkay:{
        type:Boolean
    },
    sellerOkay:{
        type:Boolean
    }
});

// [{a:"보이시나요"},{b:"아무래도그런편이죠"}]
// 실제로 소켓 구현할때 좀 변할수도있음

module.exports = mongoose.model('ChatRoom', chatRoom);