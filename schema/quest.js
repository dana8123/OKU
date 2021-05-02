const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const quest = new Schema({
    userId:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        required:true
    },
    contents:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default : Date.now
    }
});

module.exports = mongoose.model("Quest",quest)