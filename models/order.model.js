const constants = require('../constants');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    bar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bar' 
    },
    orderMenu: {
        type: [Object],
        default: []
    },

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;