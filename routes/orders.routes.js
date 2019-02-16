const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');



router.post('/:restaurantId/order',
  authMiddleware.isAuthenticated,
  userMiddleware.isRegistered,
  ordersController.doOrder);

router.post('/:restaurantId/expressOrder',
  authMiddleware.isAuthenticated,
  userMiddleware.isRegistered,
  ordersController.doExpressOrder);

router.post('/:orderId/completed',
authMiddleware.isAuthenticated,
  userMiddleware.isRegistered,
  ordersController.doPay)

module.exports = router;