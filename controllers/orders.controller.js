const createError = require('http-errors');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Place = require('../models/place.model');
const Order = require('../models/order.model');
const axios = require("axios");
const constants = require('../constants');


module.exports.doOrder = (req, res, next) => {
  console.info(req.body);
  User.findOne({
      name: res.locals.session.name
    })
    .then(user => {
      return Place.findById(req.body.favoriteBar)
        .then(place => {
          if (user && place) {
            user.set('favBar', place._id);
            return user.save()
              .then(user => {
                const order = createOrder(place, user, req.body);
                return order.save()
                  .then(order => {
                    res.render("orders/show", {
                      user,
                      place,
                      order
                    })
                  })
              })
          } else {
            return Place.findById(req.params.restaurantId)
              .then(place => {
                const order = createOrder(place, user, req.body);
                return order.save()
                  .then(order => {
                    res.render('orders/show', {
                      user,
                      place,
                      order
                    })
                  })
              })
          }
        })

    })
    .catch(error => next(error))

}

function createOrder(place, user, body) {
  const menu = place.completeMenu.map((e, index) => {
    if (body[index + 1] != 0) {
      return {
        product: e,
        unit: body[index + 1]
      }
    }
  })
  const order = new Order({
    user: user._id,
    bar: place._id,
    orderMenu: menu
  })
  return order;
}