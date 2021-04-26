const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const priceHistory = new Schema({
    userId:{
        type: String
    },
    productId: {
      type: ObjectId(),
    },
    currentPrice:{
      type: Number,
    },
});

module.exports = mongoose.model('PrieceHistory', priceHistory);