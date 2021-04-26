const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const review = new Schema({
    userId:{
        type: String,
        required:true
    },
    title:{
        type: String,
        required:true
    },
    content:{
        type: String,
        required:true
    },
    img:{
        type: String
    }
});

module.exports = mongoose.model('Review', review);