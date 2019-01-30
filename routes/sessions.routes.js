const passport = require('passport');
const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessions.controller');

router.get('/create', sessionsController.create);

router.post('/google', passport.authenticate('google-auth', { scope: ['openid', 'profile', 'email'] }));

router.get('/google/cb', sessionsController.createWithIDPCallback);

module.exports = router;