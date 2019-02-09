
const createError = require('http-errors');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Place = require('../models/place.model')
const axios = require("axios");
const constants = require('../constants');
const placesServices = require('../services/places.service');

module.exports.main = (req, res, next) => {
  const lat = req.user.origin.coordinates[1];
  const lng = req.user.origin.coordinates[0];
  placesServices.find(lat, lng)
    .then(restaurants => res.render("places/main", { restaurants }))
    .catch(error => next(error));
}

module.exports.order = (req, res, next) => {
  Place.findOne({ placeId: req.params.restaurantId})
    .then(place => {
      if (place) {
        return Promise.resolve(place);
      } else {
        return placesServices.get(req.params.restaurantId)
          .then(place  => new Place(place).save());
      }
    })
    .then(place => res.render('orders/order', { place }))
    .catch(error => next(error));
}