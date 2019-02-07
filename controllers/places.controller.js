
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


// module.exports.doMain = (req, res, next) => {
//   Place.findOne({
//       name: req.body.restaurantName
//     })
//     .then(restaurant => {
//       if (!restaurant) {
//         const menu = shuffleMenu();
//         //peticion de axios si no esta el restaurante y rellenar
//         const lat = req.body.restaurantLocationLat;
//         const lng = req.body.restaurantLocationLng;
//         const location = {
//           type: 'Point',
//           coordinates: [lng, lat]
//         };
//         const prices = randomMenu(menu);
//         const rest = new Place({
//           id: req.body.restaurantId,
//           name: req.body.restaurantName,
//           rating: req.body.restaurantRating,
//           vicinity: req.body.restaurantVicinity,
//           email: 'a.lucia.cazorla@gmail.com',
//           menu: menu,
//           location: location,
//           completeMenu: prices
//         });
//         return rest.save()
//           .then(() => {
//             res.render('places/order', {
//               rest
//             });
//           })
//       } else {
//         res.render('places/order', {
//           restaurant
//         });
//       }
//     })
//     .catch(error => next(error))
// }

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
  Place.findOne({ id: req.params.restaurantId})
  .then(place => {
    if(!place){
      console.info("entra en el if")
      axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${req.params.restaurantId}&fields=name,rating,vicinity,geometry,opening_hours&key=AIzaSyATnEHZ5TdCSSo4O5GohaYg-kEJGqiAxfE`)
      .then(response => {
        console.log(response.data)
        const menu = shuffleMenu();
        const prices = randomMenu(menu);
        const rest = new Place({
          id: req.params.restaurantId,
          name: response.data.result.name,
          rating: response.data.result.rating,
          vicinity: response.data.result.vicinity,
          email: 'a.lucia.cazorla@gmail.com',
          menu: menu,
          location: response.data.result.geometry.location,
          completeMenu: prices
        });
        return rest.save()
          .then(() => {
            res.render('places/order', {
              place
            });
          })
      })
    } else {
      console.info("entra en el else")
      res.render('places/order', { place })
    }
  })
}

module.exports.doOrder = (req, res, next) => {
  // console.log(req.body)
}