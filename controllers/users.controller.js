const createError = require('http-errors');
const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.list = (req, res, next) => {
    User.find()
    .then(users => {
        res.render('/users/list', {
            users : users
        });
    })
    .catch(error => next(error))
}