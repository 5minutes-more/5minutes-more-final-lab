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

module.exports.edit = (req, res, next) => {
  User.findOne({
      email: res.locals.session.email
    })
    .then(user => {
      res.render('users/create', { user })
    })
}

module.exports.doCreate = (req, res, next) => {

  req.user.origin.coordinates = [req.body.longitude, req.body.latitude];
  req.user.preferences = req.body.preferences;

  req.user
  .save()
  .then(user => {
    res.redirect("/")
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.render('users/create', {
        user: req.body,
        errors: error.errors
      })
    } else {
      next(error)
    }
  });  
}

module.exports.edit = (req, res, next) => {
  User.findOne({
      email: res.locals.session.email
    })
    .then(user => {
      res.render('users/create', {
        user
      })
    })
}

module.exports.doDelete = (req, res, next) => {
  User.findByIdAndRemove(req.user.id)
    .then(user => {
      if (!user) {
        next(createError(404, 'User not found'));
      } else {
        res.redirect('/users');
      }
    })
    .catch(error => next(error));
}

module.exports.doFav = (req, res, next) => {
  const { restaurantId } = req.params;
  User.findByIdAndUpdate(req.user.id, { $set: { "fav.bar": restaurantId } }, { new: true })
    .then(user => {
      if (user) {
        res.json({
          OK: true,
        })
      } else {
        next(createError(404, 'User not found'));
      }
    })
    .catch(error => next(error));
}

