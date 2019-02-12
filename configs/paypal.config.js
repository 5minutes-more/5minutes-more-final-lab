var express = require('express'); 
var paypal = require('paypal-rest-sdk');
const PAYPAL_KEY_ID = process.env.PAYPAL_KEY_ID;
const PAYPAL_KEY_SECRET = process.env.PAYPAL_KEY_SECRET;


paypal.configure({
  'mode': 'sandbox', //sandbox or live 
  'client_id': PAYPAL_KEY_ID, // please provide your client id here 
  'client_secret': PAYPAL_KEY_SECRET // provide your client secret here 
});



