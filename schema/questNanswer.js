const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const QuestNanswer = new Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    answer: {
        type: String
    },
    sellerId:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("QuestNanswer", QuestNanswer)