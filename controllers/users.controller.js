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

function addPreference(object, preference, array){
  if (object[preference]){
    array.push(preference);
  }
}

module.exports.doCreate = (req, res, next) => {
    const pref = ["coffee", "glutenfree", "juice", "cocoa", "donut", "tea", "sandwich", "salad"];

    User.findOne({
      email: res.locals.session.email
    })
    .then(user => {
      const preferences = [];
      pref.forEach(preference => {
        addPreference(req.body, preference, preferences)});
      console.log(preferences);
      if (!req.body.latitude) {
        res.render('users/create', {
          user: req.body,
          errors: { origin: 'Position is required'}
        })
      } else if (preferences.length === 0) {
        res.render('users/create', {
          user: req.body,
          errors: { preferences: 'You should select at least one preference.'}
        })
      } else {
        console.log('Entra en guardar datos')
        user.origin.type = 'Point';
        user.origin.coordinates = [req.body.longitude, req.body.latitude];
        user.preferences = preferences;
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