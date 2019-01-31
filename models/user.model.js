const constants = require('../constants');
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const SALT_WORK_FACTOR = 10;    
const FIRST_ADMIN_EMAIL = process.env.FIRST_ADMIN_EMAIL;
const SECOND_ADMIN_EMAIL = process.env.SECOND_ADMIN_EMAIL;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name is required'
    },
    email: {
        type: String,
        unique: true
    },
    social: {
        googleId: String
    },
    role: {
        type: String,
        enum: [constants.ROLE_ADMIN, constants.ROLE_GUEST],
        default: constants.ROLE_GUEST
    },
    photo: {
        type: String
    },
    origin: {
        type: {type: String, default: 'Point'},
        coordinates: [Number],
        // required: 'Location is required'
    },
    preferences: {
        type: [String],
        enum: ["coffee", "gluten free", "juice", "cocoa", "donut", "tea", "sandwich", "salad"],
        // required: 'You need to populate at least one preference'
    }
}, { timestamps: true });

userSchema.pre('save', function(next){
    if (this.email === FIRST_ADMIN_EMAIL || this.email === SECOND_ADMIN_EMAIL){
        this.role = constants.ROLE_ADMIN;
        next();
    }  else {
        next();
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;