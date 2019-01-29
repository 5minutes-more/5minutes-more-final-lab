const constants = require('../constants');

module.exports = (hbs) => {
    hbs.registerHelper('isAdmin', (user,options) => {
        if (user.role === constants.ROLE_ADMIN) {
            return options.fb(this);
        } else {
            return options.inverse(this);
        }
    })
}