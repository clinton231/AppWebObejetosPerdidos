const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

let map;
function initMap() {
    var containerMap = document.getElementById('mapa-ubicacion-detalle')
    let latitud = parseFloat(containerMap.attributes['latitud'].value)
    let longitud = parseFloat(containerMap.attributes['longitud'].value)
    let radio = parseInt(containerMap.attributes['radio'].value)
    map = new google.maps.Map(containerMap, {
        center: { lat: latitud, lng: longitud },
        zoom: 15,
    });

    let initialLocation = new google.maps.LatLng(latitud, longitud);
    new google.maps.Marker({
        position: initialLocation,
        map
    });

    if (radio) {
        new google.maps.Circle({
            strokeColor: "#0d6efd",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#0d6efd",
            fillOpacity: 0.35,
            map,
            center: { lat: latitud, lng: longitud },
            radius: radio,
        });
    }

}

window.initMap = initMap
