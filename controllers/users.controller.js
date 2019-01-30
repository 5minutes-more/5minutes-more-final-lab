const createError = require('http-errors');
const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.list = (req, res, next) => {
  User.find()
    .then(users => {
      res.render('users/list', {
        users: users
      });
    })
    .catch(error => next(error))
}

module.exports.create = (req, res, next) => {
  res.render('users/create');
}

module.exports.doCreate = (req, res, next) => {
  console.log(req.body);
  User.findOne({
      email: res.locals.session.email
    })
    .then(user => {
      if (!user.origin) {
        res.render('users/create', {
          user: req.body,
          error: error.errors
        })
      // } else if (!user.preferences) {
      //   res.render('users/create', {
      //     user: req.body,
      //     error: error.errors
      //   })
      } else {
        user.origin.type = 'Point';
        user.origin.coordinates = [req.body.longitude, req.body.latitude];
        // user.preferences = req.body.preferences;
        return user.save()
          .then (res.render('users/main', { user }))
      }
    })
    .catch(error => {
      if(error instanceof mongoose.Error.ValidationError) {
        res.render('users/create', {
          errors: error.errors
        })
      } else {
        next(error)
      }
    })
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