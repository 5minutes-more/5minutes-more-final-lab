module.exports = (hbs) => {
  hbs.registerHelper('randomImage',  options => Math.floor(Math.random() * 100))
 }