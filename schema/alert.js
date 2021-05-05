const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const alert = new Schema({
    alertType:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        required:true
    }
});

// [{a:"보이시나요"},{b:"아무래도그런편이죠"}]
// 실제로 소켓 구현할때 좀 변할수도있음

module.exports = mongoose.model('Alert', alert);