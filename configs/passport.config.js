const User = require('../models/user.model');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then(user => {
      next(null, user);
    })
    .cath(error => next(error));
})

passport.use('google-auth', new GoogleStrategy({
  clientID: process.env.GOOGLE_AUTH_CLIENT_ID || 'todo',
  clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || 'todo',
  callbackURL: process.env.GOOGLE_AUTH_CB || '/sessions/google/cb'
}, autenticateOAuthUser));

function autenticateOAuthUser(accesToken, refreshToken, profile, next) {
  const social = `${profile.provider}Id`;
  User.findOne({
      [`social.${social}`]: profile.id
    })
    .then(user => {
      if (user) {
        next(null, user);
      } else {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          social: {
            [social]: profile.id
          }
        });
        return user.save()
          .then(user => {
            next(null, user)
          })
      }
    })
    .catch(error => next(error));
}