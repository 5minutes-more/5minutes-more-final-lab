const express = require('express');
const router = express.Router();
const placesController = require('../controllers/places.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');



router.get('/',
  authMiddleware.isAuthenticated,
  userMiddleware.isRegistered,
  placesController.main);

router.get('/:restaurantId',
  authMiddleware.isAuthenticated,
  userMiddleware.isRegistered,
  placesController.order);

router.post('/:restaurantId/order',
  authMiddleware.isAuthenticated,
  userMiddleware.isRegistered,
  placesController.doOrder);


module.exports = router;  