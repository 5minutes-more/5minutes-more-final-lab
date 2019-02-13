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
  const menu = [];

  place.menu.forEach((product, index) => {
    if (values[index] != '') {
      menu.push({
        name: product.name,
        price: product.price,
        units: values[index]
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