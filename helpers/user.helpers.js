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
        if (user.preferences && user.preferences.indexOf(preference.id) !== -1) {
            return "checked";
        } else {
            return;
        }
    })

    hbs.registerHelper('isFavBar', (user, place) => {
        if (user === place){
            return "favorite";
        } else {
            return "";
        }
    })

    hbs.registerHelper('isFavOrderMenu', (UserOrder, PlaceOrder) => {
        if (UserOrder === PlaceOrder){
            return "favorite";
        } else {
            return "";
        }
    })

    hbs.registerHelper('isFavMenu', (user, place) => {
        if (user === place){
            return "";
        } else {
            return "hide-button";
        }
    })
}

