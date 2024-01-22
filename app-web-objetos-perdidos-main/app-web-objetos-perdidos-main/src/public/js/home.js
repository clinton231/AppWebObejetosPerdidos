const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const query = new URLSearchParams(window.location.search)
// Inicialización del mapa
var geocoder;
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('mapa-home'), {
        center: { lat: 43.5293, lng: -5.6773 },
        zoom: 13,
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            fetch(`/publicaciones-ubicaciones${window.location.search}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((response) => response.json())
                .then(data => {
                    // Create an info window to share between markers.
                    const infoWindow = new google.maps.InfoWindow();
                    data.forEach(publicacion => {
                        const m = new google.maps.Marker({
                            position: { lat: parseFloat(publicacion.DatosUbicacion.Latitud), lng: parseFloat(publicacion.DatosUbicacion.Longitud) },
                            map: map,
                            title: `<span>${publicacion.Id}. <a href='/detalle/${publicacion.Id}'>${publicacion.Titulo}</a></span>`,
                        });
                        m.addListener("click", () => {
                            infoWindow.close();
                            infoWindow.setContent(m.getTitle());
                            infoWindow.open(m.getMap(), m);
                        });
                    });
                })
                .catch(error => {
                    alert("Ha ocurrido un error al obtener las ubicaciones de las publicaciones")
                })
            const marker = new google.maps.Marker({
                position: { lat: position.coords.latitude, lng: position.coords.longitude },
                map: map,
                icon: "../img/current-location.png"
            });
            let initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
        });
    }
}
window.initMap = initMap

document.querySelectorAll('input[name="tipoPublicacion"]').forEach(element => {
    element.addEventListener("click", (event) => {
        if (parseInt(event.target.value) === TIPOS_PUBLICACION.PERDIDO) {
            query.set("tipo", TIPOS_PUBLICACION.PERDIDO)
        } else {
            //ENCONTRADO
            query.set("tipo", TIPOS_PUBLICACION.ENCONTRADO)
        }
        window.location.href = "?" + query.toString()
    })
})

//MANEJO DE FORMULARIO. DESDE ACA
const llenarComboLocalidades = (idProvincia) => {
    fetch(`/localidades/${idProvincia}`, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => response.json())
        .then(data => {
            const elementLocalidades = document.querySelector('#localidad')
            let options = elementLocalidades.getElementsByTagName('option');

            for (var i=options.length; i--;) {
                elementLocalidades.removeChild(options[i]);
            }
            data.forEach(localidad => {
                let opcion = document.createElement("option");
                opcion.text = localidad.Descripcion;
                opcion.value = localidad.IdLocalidad;
                opcion.selected = elementLocalidades.value == localidad.IdLocalidad
                elementLocalidades.add(opcion);
            });
        })
        .catch(error => {
            alert("Ha ocurrido un error al obtener las localidades de esa provincia")
        })
}

document.querySelector('#provincia').addEventListener("change", e => {
    llenarComboLocalidades(e.target.value)
})

if (document.getElementById("provincia").value) {
    llenarComboLocalidades(document.getElementById("provincia").value)
}

document.querySelector('#limpiarFiltros').addEventListener("click", e => {
    window.location.href = "?tipo=" + query.get("tipo")
})

//MANEJO DE FORMULARIO. HASTA ACA


