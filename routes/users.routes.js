const constants = require('../constants');
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');

router.get('/list',
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole(constants.ROLE_ADMIN),
  usersController.list);

router.get('/create',
  authMiddleware.isAuthenticated,
  usersController.create);

router.post('/create',
  authMiddleware.isAuthenticated,
  usersController.doCreate)

router.get('/edit',
  authMiddleware.isAuthenticated,
  usersController.edit);

router.post('/:id/delete',
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole(constants.ROLE_ADMIN),
  usersController.doDelete);

router.post('/fav/:restaurantId', usersController.doFav);
router.post('/fav/:restaurantId/order', usersController.doMenuFav);


module.exports = router;