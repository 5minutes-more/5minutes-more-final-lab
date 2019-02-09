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
                     console.log(order)
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
  // console.info("completeMenu =>", place.completeMenu);
  const values = Object.values(body);
  // console.log(values)
  const menu = [];
  if (Object.keys(body)[0] != 'favoriteBar'){
    place.completeMenu.forEach((e, index) => {
      if (values[index] != '') {
        menu.push({
          product: e,
          unit: values[index]
        })
      }
    })
  } else {
    place.completeMenu.forEach((e, index) => {
      if (values[index+1] != '') {
        menu.push({
          product: e,
          unit: values[index+1]
        })
      }
    })
  }
  const total = menu.reduce((acc, a) => {
    return acc += a.product.price * a.unit;
  },0)

  // console.info("menu =>", menu);
  const order = new Order({
    user: user._id,
    bar: place._id,
    orderMenu: menu,
    total: total.toFixed(2)
  })
  console.info("order =>", order);
  return order;
}