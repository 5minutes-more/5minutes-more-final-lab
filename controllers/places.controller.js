
const createError = require('http-errors');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Place = require('../models/place.model')
const axios = require("axios");
const constants = require('../constants');

module.exports.main = (req, res, next) => {
  axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.user.origin.coordinates[1]},${req.user.origin.coordinates[0]}&radius=500&type=bar&keyword=breakfast&key=AIzaSyATnEHZ5TdCSSo4O5GohaYg-kEJGqiAxfE`)
    .then(response => {
      // response.data.results.forEach(e => {
      //   const lat = e.geometry.location.lat;
      //   console.info(' => ', lat);
      // })
      // console.log(response.data.results);
      res.render("places/main", {
        restaurants: response.data.results
      })
    })
    .catch(error => next(error))
}

function randomMenu(arr){
  let res = [];
  arr.forEach(e => {
    const price = (Math.random()*3).toFixed(2);
    const obj = {
      pref: e,
      price: price
    }
    res.push(obj);
  })
  return res;
}

function shuffleMenu() {
  return constants.PREF_CONST.map(p => p.id).sort(function () {
    return Math.random() - 0.5
  }).slice(0, Math.random() * constants.PREF_CONST.length + 1)
}

module.exports.order = (req, res, next) => {
  console.log(req.params.restaurantId)
  Place.findOne({ placeId: req.params.restaurantId})
  .then(place => {
    if(!place){
      return axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${req.params.restaurantId}&fields=name,rating,vicinity,geometry,opening_hours&key=AIzaSyATnEHZ5TdCSSo4O5GohaYg-kEJGqiAxfE`)
      .then(response => {
        const menu = shuffleMenu();
        const prices = randomMenu(menu);
        const rest = new Place({
          _id: new mongoose.Types.ObjectId(),
          placeId: req.params.restaurantId,
          name: response.data.result.name,
          rating: response.data.result.rating,
          vicinity: response.data.result.vicinity,
          email: 'a.lucia.cazorla@gmail.com',
          menu: menu,
          location: response.data.result.geometry.location,
          completeMenu: prices
        });
        return rest.save()
          .then( place => {
            res.render('orders/order', {
              place
            });
          })
      })
    } else {
      res.render('orders/order', { place })
    }
  })
  .catch(error => next(error));
}