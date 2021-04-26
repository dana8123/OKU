const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const like = new Schema({
    userId:{
        type: String,
        required:true
    },
    productId:{
        type: String,
        required:true
    },
    productImage:{
        type: String,
        required:true
    },
    sellerId:{
        type: String
    }
});

module.exports = mongoose.model('Like', like);