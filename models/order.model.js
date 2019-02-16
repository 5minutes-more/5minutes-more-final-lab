const constants = require('../constants');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    bar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place' 
    },
    orderMenu: [{
        name: String,
        price: Number,
        units: Number
    }],
    total: {
        type: Number,
        default: 0
    },
    payStatus: {
        type: String,
        enum: ["payed", "pending", "rejected"]
    }

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;