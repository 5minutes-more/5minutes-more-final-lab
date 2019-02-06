const constants = require('../constants');
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');

router.get('/',
  authMiddleware.isAuthenticated,
  usersController.main);

router.get('/list',
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole(constants.ROLE_ADMIN),
  usersController.list);

router.get('/create',
  authMiddleware.isAuthenticated,
  userMiddleware.isRegistered,
  usersController.create);

router.post('/create',
  usersController.doCreate)

router.get('/edit',
  authMiddleware.isAuthenticated,
  usersController.edit);

// router.post('/edit',
//   authMiddleware.isAuthenticated,
//   usersController.doEdit);

router.get('/main',
  authMiddleware.isAuthenticated,
  usersController.main);

router.post('/main',
  authMiddleware.isAuthenticated,
  usersController.doMain);

router.post('/:id/delete',
  authMiddleware.isAuthenticated,
  authMiddleware.checkRole(constants.ROLE_ADMIN),
  usersController.doDelete);

router.get('/order',
  authMiddleware.isAuthenticated,
  usersController.order);

router.post('/order',
  authMiddleware.isAuthenticated,
  usersController.doOrder);

module.exports = router;