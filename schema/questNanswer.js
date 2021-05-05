const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const QuestNanswer = new Schema({
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
    },
    answer:{
        type:String
    }
});

module.exports = mongoose.model("QuestNanswer",QuestNanswer)