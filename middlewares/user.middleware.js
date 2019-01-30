const createError = require('http-errors');

module.exports.isRegistered = (req, res, next) => {
    const { origin, preferences } = res.locals.session
    if (!origin.coordinates.length && !preferences.length){
        next();
    } else {
        res.redirect('/users/main');
    }
}