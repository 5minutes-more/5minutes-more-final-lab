const createError = require('http-errors');
const Place = require('../models/place.model');
const Order = require('../models/order.model');



module.exports.doOrder = (req, res, next) => {
  Place.findById(req.params.restaurantId)
    .then(place => {
      const order = createOrder(place, req.user, req.body);
      if (order.total != 0){
      return order.save()
        .then(order => {
          res.render('orders/show', {
            place,
            order
          })
        })
      } else {
        res.render('orders/order',{ place })
      }    
      })
    
    .catch(error => next(error))
}

module.exports.doExpressOrder = (req, res, next) => {
  console.log("user fav",req.user.fav)
  const place = req.user.fav.bar;
  const order = new Order({
    user: req.user._id,
    place: place._id,
    orderMenu: req.user.fav.menu.orderMenu,
    total: req.user.fav.menu.total
  });
  order.save()
    .then(order => {
      console.log("order menu", order);
      res.render('orders/show', {
        place,
        order
      })
    })
    .catch(error => next(error));
}

function createOrder(place, user, body) {
  const values = Object.values(body);
  console.log(values);
  const menu = [];

  place.menu.forEach((product, index) => {
    if (values[index+2] != '') {
      menu.push({
        name: product.name,
        price: product.price,
        units: values[index+2]
      })
    }
  })

  const total = menu.reduce((acc, a) => {
    return acc += a.price * a.units;
  }, 0)

  const order = new Order({
    user: user._id,
    bar: place._id,
    orderMenu: menu,
    total: Number(total.toFixed(2))
  })
  return order;
}


module.exports.doPay = (req,res, next) => {
  // Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_JBEiTzcKQiURs19EBdULsyNj");
console.log("params => ",req.params)

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
const token = req.body.stripeToken; // Using Express
Order.findById(req.params.orderId)
  .populate('user')
  .populate('bar')
  .then(order => {
    (async () => {
      const charge = await stripe.charges.create({
        amount: order.total,
        currency: 'eur',
        description: 'Example charge',
        source: token,
      })
      console.log('charge', charge);
    })();
    res.render('orders/completed', { order })
  })
  .catch(error => res.render('orders/error', { error }))
}