class Map {
    constructor(containerDomElement) {
      this.containerDomElement = containerDomElement;
      this.googleMap = null;
      this.markers = [];
    }
  
    init() {
      this.googleMap = new google.maps.Map(this.containerDomElement, {
        zoom: 5,
        center: {
          lat: 40.438,
          lng: -3.682
        }
      });
    }
  
    addMarker(lat, lng, id) {
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.googleMap,
        id: id
      });
  
      this.markers.push(marker);
    }
  
    clearMarkers() {
      this.markers.forEach(m => m.setMap(null));
      this.markers = [];
    }
  
    onClick(cb) {
      this.googleMap.addListener('click', cb);
    }
  
    showOnlyMarker(markerId) {
      this.markers.forEach(marker => {
        if (marker.id !== markerId) {
          marker.setMap(null);
        }
      })
    }
  
    showAllMarkers() {
      this.markers.forEach(marker => marker.setMap(this.googleMap));
    }
  }
  