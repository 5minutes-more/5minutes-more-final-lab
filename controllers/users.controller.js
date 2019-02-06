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

module.exports.edit = (req, res, next) => {
  User.findOne({
      email: res.locals.session.email
    })
    .then(user => {
      res.render('users/create', { user })
      //llamar al usuario
    })
}

function addPreference(object, preference, array) {
  if (object[preference]) {
    array.push(preference);
  } else {
    array.push(undefined);
  }
}

function isEmpty(array) {
  let res = true
  array.forEach(e => {
    if (e != undefined) {
      res = false
    }
  })
  return res
}

module.exports.doCreate = (req, res, next) => {
  console.log(req.body)
  req.user.origin.coordinates = [req.body.longitude, req.body.latitude];
  req.user.preferences = req.body.preferences;

  req.user
  .save()
  .then(user => {
    res.redirect("/users/main")
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

module.exports.main = (req, res, next) => {
  axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.user.origin.coordinates[1]},${req.user.origin.coordinates[0]}&radius=500&type=bar&keyword=breakfast&key=AIzaSyATnEHZ5TdCSSo4O5GohaYg-kEJGqiAxfE`)
    .then(response => {
      // response.data.results.forEach(e => {
      //   const lat = e.geometry.location.lat;
      //   console.info(' => ', lat);
      // })
      // console.log(response.data.results);
      res.render("users/main", {
        restaurants: response.data.results
      })
    })
    .catch(error => next(error))
}


module.exports.doMain = (req, res, next) => {
  Place.findOne({
      name: req.body.restaurantName
    })
    .then(restaurant => {
      if (!restaurant) {
        const menu = shuffleMenu();
        //peticion de axios si no esta el restaurante y rellenar
        const lat = req.body.restaurantLocationLat;
        const lng = req.body.restaurantLocationLng;
        const location = {
          type: 'Point',
          coordinates: [lng, lat]
        };
        const prices = randomMenu(menu);
        const rest = new Place({
          id: req.body.restaurantId,
          name: req.body.restaurantName,
          rating: req.body.restaurantRating,
          vicinity: req.body.restaurantVicinity,
          email: 'a.lucia.cazorla@gmail.com',
          menu: menu,
          location: location,
          completeMenu: prices
        });
        return rest.save()
          .then(() => {
            res.render('user/order', {
              rest
            });
          })
      } else {
        res.render('users/order', {
          restaurant
        });
      }
    })
    .catch(error => next(error))
}

function randomMenu(arr){
  let res = [];
  arr.forEach(e => {
    console.info(Math.random()*3);
    const price = (Math.random()*3).toFixed(2);
    const obj = {
      pref: e,
      price: price
    }
    res.push(obj);
  })
  console.info(res);
  return res;
}

function shuffleMenu() {
  return constants.PREF_CONST.sort(function () {
    return Math.random() - 0.5
  }).slice(0, Math.random() * constants.PREF_CONST.length + 1)
}

module.exports.order = (req, res, next) => {
  res.render('users/order');
}

module.exports.doOrder = (req, res, next) => {
  // console.log(req.body)
}