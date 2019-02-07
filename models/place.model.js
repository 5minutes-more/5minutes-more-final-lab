const constants = require('../constants');
const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    id:{
        type: String,
    },
    email: {
        type: String,
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
    menu:  {
        type: [String],
        enum: constants.PREF_CONST.map(p => p.id),
        default: []
        // required: 'You need to populate at least one preference'
    },
    completeMenu : {
        type: [Object]
    }
}, { timestamps: true });

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;