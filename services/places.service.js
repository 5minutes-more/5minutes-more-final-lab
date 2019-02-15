const axios = require('axios');
const API_PATH = 'https://maps.googleapis.com/maps/api/place';
const API_KEY = process.env.PLACES_KEY;
const FIND_RADIUS = 1000;
const DEFAULT_PLACE_EMAIL = 'a.lucia.cazorla@gmail.com';
const constants = require('../constants');

module.exports.find = (lat, lng) => {
    return axios.get(`${API_PATH}/nearbysearch/json`, {
        params: {
            location: `${lat},${lng}`,
            radius: FIND_RADIUS,
            keyword: 'breakfast',
            key: API_KEY
        }
    }).then(response => {
        const places = response.data.results;
        return Promise.resolve(places);
    });
}

module.exports.get = (placeId) => {
    return axios.get(`${API_PATH}/details/json`, {
        params: {
            placeid: placeId,
            fields: 'name,rating,vicinity,geometry,opening_hours',
            key: API_KEY
        }
    }).then(response => {
        const place = response.data.result;
        const info = randomizeMenu();
        const location = [place.geometry.location.lng,place.geometry.location.lat]
        return Promise.resolve({
            placeId: placeId,
            name: place.name,
            rating: Number(place.rating),
            vicinity: place.vicinity,
            email: DEFAULT_PLACE_EMAIL,
            preferences: info.preferences,
            menu: info.menu,
            "location.coordinates": location,
          })
    });
}

function randomizeMenu() {
    const preferences = constants.PREF_CONST
        .map(p => p.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.random() * constants.PREF_CONST.length + 1);
    const menu = [];
    preferences.forEach(preference => {
        const price =(Math.random() * 3).toFixed(2);
        menu.push({
            //name: random(constants.products[preference]),
            name: preference,
            price: price
        });
      });
    
    return {
        preferences: preferences,
        menu: menu
    }
}


