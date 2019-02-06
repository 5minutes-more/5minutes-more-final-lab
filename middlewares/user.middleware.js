const createError = require('http-errors');

module.exports.isRegistered = (req, res, next) => {
    if (req.user.origin.coordinates && req.user.preferences.length > 1) {
        next();
    } else {
        res.redirect('/users/create');
    }
} 