
router.get('/:restaurant/order',
  authMiddleware.isAuthenticated,
  userMiddleware.isRegistered,
  usersController.order);