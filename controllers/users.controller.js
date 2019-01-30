const createError = require('http-errors');
const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.list = (req, res, next) => {
    User.find()
    .then(users => {
        console.log('Entra')
        res.render('users/list', {
            users : users
        });
    })
    .catch(error => next(error))
}

module.exports.doDelete = (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
    .then(user => {
        if (!user) {
            next(createError(404, 'User not found'));
        } else {
            res.redirect('/users');
        }
    })
    .catch(error => next(error));
}