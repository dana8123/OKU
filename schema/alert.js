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


module.exports = mongoose.model('Alert', alert);