const mongoose = require("mongoose");
const { ObjectId } = require('bson'); //A BSON (Binary JSON) object ID used for generating unique identifiers.
const ShortUniqueId = require('short-unique-id');

// random String Generator
const randomStr = new ShortUniqueId();

const shortURLSchema =  new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    fullURL: {
        type: String,
        required: true,
        trim: true
    },
    shortURL: {
        type: String,
        required: true,
        trim: true,
        default: () => randomStr.rnd()
    },
    count: {
        type: Number,
        required: true,
        default: 0
    },
    time: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const ShortURL = mongoose.model('ShortUrl', shortURLSchema); 

module.exports =  ShortURL 