module.exports = (hbs) => {
  hbs.registerHelper('addStar', (place, options) => {
      while (Number(place.rating) > 0.5){
          place.rating --;
          return '<fa fa-star>'
      };
      if (place.rating >= 0.5){
          return '<fa fa-star-half>';
      }
  })
}

module.exports = (hbs) => {
  hbs.registerHelper('isCategorySelected', (user, category, categories, options) => {
 
    return user.categories.indexOf(category.id) !== -1 ||
      (categories && categories.indexOf(category.id) !== -1) ? 'checked' : '';
  })
 }