const constants = require('../constants');

module.exports = (hbs) => {
    hbs.registerHelper('isAdmin', (user,options) => {
        if (user.role === constants.ROLE_ADMIN) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    })

    hbs.registerHelper('hasPreference', (user, preference, allPreferences) => {
        console.log(user);
        if (user.preferences && user.preferences.indexOf(preference.id) !== -1) {
            return "checked";
        } else {
            return;
        }
    })
}

