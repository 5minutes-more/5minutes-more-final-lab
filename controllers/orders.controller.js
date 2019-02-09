const createError = require('http-errors');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Place = require('../models/place.model');
const Order = require('../models/order.model');
const axios = require("axios");
const constants = require('../constants');


module.exports.doOrder = (req, res, next) => {
  Place.findById(req.params.restaurantId)
    .then(place => {
      const order = createOrder(place, req.user, req.body);
      return order.save()
        .then(order => {
          res.render('orders/show', {
            place,
            order
          })
        })
    })
    .catch(error => next(error))
}

function createOrder(place, user, body) {
  const values = Object.values(body);
  const menu = [];

  if (Object.keys(body)[0] != 'favoriteBar') {
    place.menu.forEach((product, index) => {
      if (values[index] != '') {
        menu.push({
          name: product.name,
          price: product.price,
          units: values[index]
        })
      }
    })
  } else {
    place.completeMenu.forEach((product, index) => {
      if (values[index + 1] != '') {
        menu.push({
          name: product.name,
          price: product.price,
          units: values[index + 1]
        })
      }
    })
  }
  const total = menu.reduce((acc, a) => {
    return acc += a.price * a.units;
  }, 0)

  const order = new Order({
    user: user._id,
    bar: place._id,
    orderMenu: menu,
    total: Number(total.toFixed(2))
  })
  console.info("order =>", order);
  return order;
}