const passport = require('passport');

module.exports.create = (req, res, next) => {
    res.render('sessions/create');
}

module.exports.createWithIDPCallback = (req, res, next) => {
    passport.authenticate(`google-auth`, (error, user) => {
        if (error) {
            next(error);
        } else {
            req.login(user, (error) => {
                if (error) {
                    next(error);
                } else {
                    res.redirect('/users')
                }
            })
        }
    })(req, res, next);
}

