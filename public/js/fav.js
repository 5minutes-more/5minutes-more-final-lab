var favBtn = document.getElementById('fav-btn')

function doFav(event) {
    const restaurantId = event.target.value;
    axios.post(`/users/fav/${restaurantId}`)
        .then(response => {
            if (response.data.OK) {
                favBtn.classList.add('favorite');
            }
        })
        .catch(error => console.log(error));
}

favBtn.addEventListener('click', doFav)