const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');

router.post('/:restaurantId/order',
  authMiddleware.isAuthenticated,
  userMiddleware.isRegistered,
  ordersController.doOrder);

module.exports = router;  