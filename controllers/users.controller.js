const createError = require('http-errors');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Place = require('../models/place.model')
const axios = require("axios");
const constants = require('../constants');

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
    User.findOne({
      email: res.locals.session.email
    })
    .then(user => {
      const preferences = [];
      constants.PREF_CONST.forEach(preference => {
        addPreference(req.body, preference, preferences)});
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
        user.origin.type = 'Point';
        user.origin.coordinates = [req.body.longitude, req.body.latitude];
        user.preferences = preferences;
        return user.save()
          .then ( user => {
            return axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.user.origin.coordinates[1]},${req.user.origin.coordinates[0]}&radius=500&type=bar&keyword=breakfast&key=AIzaSyATnEHZ5TdCSSo4O5GohaYg-kEJGqiAxfE`)
            .then(response => {
              res.render("users/main", { user, restaurants: response.data.results })
            })
          })
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

module.exports.main = (req, res, next) => {
  axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.user.origin.coordinates[1]},${req.user.origin.coordinates[0]}&radius=500&type=bar&keyword=breakfast&key=AIzaSyATnEHZ5TdCSSo4O5GohaYg-kEJGqiAxfE`)
    .then(response => {
      response.data.results.forEach(e => {
        console.info(' => ', e.geometry.location);
      })
      console.log(response.data.results)
      res.render("users/main", { restaurants: response.data.results })
    })
    .catch(error => next(error))
}

