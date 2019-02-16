const constants = require('../constants');
const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    placeId: String,
    email: String,
    name: {
        type: String,
        required: 'Name is required'
    },
    rating: Number,
    photo: String,
    location: {
        type: {type: String, default: 'Point'},
        coordinates: [Number],
    },
    vicinity: String,
    preferences:  {
        type: [String],
        enum: constants.PREF_CONST.map(p => p.id),
        default: []
        // required: 'You need to populate at least one preference'
    },
    menu:  [{
        name: String,
        price: Number
    }],
}, { timestamps: true });

placeSchema.index({location: '2dsphere'});

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;