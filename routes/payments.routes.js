var express = require('express');
const router = express.Router();
var paypal = require('paypal-rest-sdk');
// const paymentsController = require('../controllers/payments.controller');

router.get('/:restaurantId/order/pay', (req, res) => {
  var payment = {
    "intent": "authorize",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://localhost:3000/success",
      "cancel_url": "http://localhost:3000/err"
    },
    "transactions": [{
      "amount": {
        "total": 10,
        "currency": "EUR"
      },
      "description": "Description example"
    }]
  }

  createPay( payment ) 
  .then( ( transaction ) => {
      var id = transaction.id; 
      var links = transaction.links;
      var counter = links.length; 
      while( counter -- ) {
          if ( links[counter].method == 'REDIRECT') {
    // redirect to paypal where user approves the transaction 
              return res.redirect( links[counter].href )
          }
      }
  })
  .catch( ( err ) => { 
      console.log( err ); 
      res.redirect('/err');
  });
})

router.get('/success' , (req ,res ) => {
  console.log(req.query); 
  res.redirect('/success.html'); 
})

router.get('/err' , (req , res) => {
  console.log(req.query); 
  res.redirect('/err.html'); 
})

var createPay = ( payment ) => {
  return new Promise( ( resolve , reject ) => {
      paypal.payment.create( payment , function( err , payment ) {
       if ( err ) {
           reject(err); 
       }
      else {
          resolve(payment); 
      }
      }); 
  });
}	

module.exports = router;