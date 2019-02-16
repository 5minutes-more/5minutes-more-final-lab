const moment = require('moment');

module.exports = (hbs) => {
  hbs.registerHelper('mult', (lvalue, rvalue, options) => lvalue * rvalue);

  hbs.registerHelper('clasif-food', (food, options) => {
    switch (food) {
      case "coffee":
        return "fas fa-mug-hot";
      case "glutenfree":
        return "fas fa-bread-slice";
      case "juice":
        return "fas fa-glass-whiskey";
      case "cocoa":
        return "fas fa-mug-hot";
      case "donut":
        return "fas fa-dot-circle";
      case "tea":
        return "fas fa-mug-hot";
      case "sandwich":
        return "fas fa-bread-slice";
      case "salad":
        return "fas fa-carrot";
    }

  })

  hbs.registerHelper('date-format', (date) => {
    return moment(date).format('YYYY-MM-DD');
  });
}