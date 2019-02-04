const constants = require('../constants');
const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    id:{
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: 'Name is required'
    },
    rating: {
        type: String,
    },
    photo: {
        type: String
    },
    location: {
        type: {type: String, default: 'Point'},
        coordinates: [Number],
    },
    vicinity: {
        type: String,
    },
    menu: {
        type: [String],
        enum: ["coffee", "glutenfree", "juice", "cocoa", "donut", "tea", "sandwich", "salad"],
    }
}, { timestamps: true });

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;