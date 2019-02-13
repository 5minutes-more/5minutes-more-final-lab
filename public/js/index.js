function initMap() {
  const domElement = document.getElementById("map");

  if (!domElement) {
    return;
  }

  window.map = new MyMap(domElement);
  window.map.init();

  //search box
  const input = document.getElementById('pac-input');
  const searchBox = new google.maps.places.SearchBox(input);
  window.map.googleMap.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

  window.map.googleMap.addListener('bounds_changed', function () {
    searchBox.setBounds(window.map.googleMap.getBounds());
  });

  searchBox.addListener('places_changed', function () {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    window.map.clearMarkers();

    const bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log('Retunred place contains no geometry');
        return;
      }

      window.map.markers.push(new google.maps.Marker({
        map: window.map.googleMap,
        position: place.geometry.location
      }));

      document.getElementById('latitude').value = place.geometry.location.lat().toFixed(3);
      document.getElementById('longitude').value = place.geometry.location.lng().toFixed(3);

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(places.geometry.location);
      }
    });
    window.map.googleMap.fitBounds(bounds);
    
  })



  if (navigator.geolocation) {
    centerMapOnBrowser();
  }


  // means we are on create users page!
  if (document.getElementById("create-user")) {
    window.map.onClick((event) => {
      window.map.clearMarkers();
      addMarkerAndUpateForm(event.latLng.lat(), event.latLng.lng());
    })

  //  means we are on list users page!
  } else if (document.getElementById("list-users")) {
    addUsersMarkers();

  //means we are on order page!  
  } else if (document.getElementById("order-page")){
    addMarker(document.getElementById("lat").value,document.getElementById("lng").value);
    showAllMarkers();
  } else {
  }
}

function centerMapOnBrowser() {
  navigator.geolocation.getCurrentPosition((position) => {
    window.map.googleMap.setCenter({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });

    window.map.googleMap.setZoom(16);

    // means we are on create users page!
    if (document.getElementById("create-user")) {
      addMarkerAndUpateForm(position.coords.latitude, position.coords.longitude);
    }
  });
}

function addMarkerAndUpateForm(lat, lng) {
  window.map.addMarker(lat, lng);

  document.getElementById('latitude').value = lat.toFixed(3);
  document.getElementById('longitude').value = lng.toFixed(3);
}

function addUsersMarkers() {
  const liElements = document.getElementsByClassName("user-item");

  for (let i = 0; i < liElements.length; i++) {
    addUserMarker(liElements[i].dataset.location, liElements[i].dataset.id);

    liElements[i].addEventListener("mouseover", function () {
      window.map.showOnlyMarker(this.dataset.id);
    });

    liElements[i].addEventListener("mouseout", function () {
      window.map.showAllMarkers();
    });
  }
}

function addUserMarker(lngLatString, id) {
  const lat = Number(lngLatString.split(',')[1]);
  const lng = Number(lngLatString.split(',')[0]);

  window.map.addMarker(lat, lng, id);
}