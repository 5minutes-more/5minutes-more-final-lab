var favBtn = document.getElementById('fav-menu-btn')

function doMenuFav(event) {
    const restaurantId = event.target.value;
    console.log(restaurantId)
    
    axios.post(`/users/fav/${restaurantId}/order`, { order: favBtn.value })
        .then(response => {
            console.log(response)
            if (response.data.OK) {
                favBtn.classList.add('favorite');
            }
        })
        .catch(error => console.log(error));
}

favBtn.addEventListener('click', doMenuFav)