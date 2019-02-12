var favBtn = document.getElementById('fav-menu-btn')

function doMenuFav(event) {
    const restaurantId = event.target.value;
    axios.post(`/users/fav/${restaurantId}/order`)
        .then(response => {
            if (response.data.OK) {
                favBtn.classList.add('favorite');
            }
        })
        .catch(error => console.log(error));
}

favBtn.addEventListener('click', doMenuFav)