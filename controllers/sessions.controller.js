const passport = require('passport');

module.exports.create = (req, res, next) => {
    res.render('sessions/create');
}

module.exports.createWithIDCallback = (req, res, next) => {
    passport.authenticate(`${req.params.provider}-auth`, (error, user) => {
        if (error) {
            next(error);
        } else {
            req.login(user, (error) => {
                if (error) {
                    next(error);
                } else {
                    res.redirect('/users/list')
                }
            })
        }
    })(req, res, next)
}