const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const answer = new Schema({
    userId:{
        type:String,
        required:true
    },
    questId:{
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

module.exports = mongoose.model("Answer",answer)