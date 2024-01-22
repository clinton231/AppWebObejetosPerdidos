const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// Inicialización del mapa
var geocoder;
let map;
let radioCircle;
function initMap() {
    map = new google.maps.Map(document.getElementById('mapa-ubicacion'), {
        center: { lat: 43.5293, lng: -5.6773 },
        zoom: 13,
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
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

window.initMap = initMap;

//INIT
let seccionPreguntasSeguridad = document.getElementById("seccionPreguntasSeguridad")
let seccionOfreceRecompensa = document.getElementById("seccionOfreceRecompensa")
let containerRadio = document.getElementById("containerRadio")

document.querySelectorAll('input[name="tipoPublicacion"]').forEach(element => {
    element.addEventListener("click", (event) => {
        if (parseInt(event.target.value) === TIPOS_PUBLICACION.PERDIDO) {
            seccionPreguntasSeguridad.classList.add("d-none")
            seccionOfreceRecompensa.classList.remove("d-none")
            containerRadio.classList.remove("d-none")
        } else {
            //ENCONTRADO
            seccionPreguntasSeguridad.classList.remove("d-none")
            seccionOfreceRecompensa.classList.add("d-none")
            containerRadio.classList.add("d-none")
        }
    })
})

document.querySelector('#localizarDireccionEnMapa').addEventListener("click", e => {
    let direccion = document.querySelector('#direccion')
    let localidad = document.querySelector('#localidad')
    let provincia = document.querySelector('#provincia')
    let radio = document.querySelector('#radio')
    let tipoPublicacion = document.querySelector('input[name="tipoPublicacion"]:checked').value

    //obtengo los datos del modal
    let modalBody = document.querySelector("#modalErroresLocalizacion .modal-body")
    const modalErroresLocalizacion = new bootstrap.Modal('#modalErroresLocalizacion', {
        keyboard: false
    })
    if (direccion.value === "" || localidad.value === "-1" || provincia.value === "-1" || (parseInt(tipoPublicacion) === TIPOS_PUBLICACION.PERDIDO && radio.value === '')) {
        modalBody.innerHTML = `Para poder localizar la dirección en el mapa, es requisito completar todos los datos de ubicación`
        modalErroresLocalizacion.show()
    }

    let address = `${direccion.value}, ${localidad.options[localidad.selectedIndex].text}, ${provincia.options[provincia.selectedIndex].text}`;

    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            let marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            if(parseInt(tipoPublicacion) === TIPOS_PUBLICACION.PERDIDO){
                radioCircle?.setMap(null)
                radioCircle = new google.maps.Circle({
                    strokeColor: "#0d6efd",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#0d6efd",
                    fillOpacity: 0.35,
                    map,
                    center: {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    },
                    radius: parseInt(radio.value),
                  });
            }
            // let initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(results[0].geometry.location);
            map.setZoom(15)

            //SETEAMOS LOS INPUT HIDDEN CON LOS VALORES
            document.getElementById("latitud").value=results[0].geometry.location.lat()
            document.getElementById("longitud").value=results[0].geometry.location.lng()
        } else {
            modalBody.innerHTML = `Ha ocurrido un error con el servicio de geocodificación. Intente nuevamente`
            modalErroresLocalizacion.show()
            console.log("Error geocode: ", status);
        }
    });
})

// SOLO agregamos la validacion "required" en html, para que las demas las hagamos por JS y podamos manejar el style del form
document.querySelector('#formPublicacion').addEventListener("submit", e => {
    resetErrorsForm()

    let errors = validarFormulario(
        e.target.elements['titulo'].value,
        e.target.elements['tipoPublicacion'].value,
        e.target.elements['descripcion'].value,
        e.target.elements['fecha'].value,
        e.target.elements['fotos'].files,
        e.target.elements['direccion'].value,
        e.target.elements['provincia'].value,
        e.target.elements['localidad'].value,
        e.target.elements['latitud'].value,
        e.target.elements['longitud'].value,
        e.target.elements['radio'].value,
        e.target.elements['email'].value,
        e.target.elements['telefono'].value,
        e.target.elements['celular'].value,
        e.target.elements['palabrasClaves'].value,
        {
            pregunta1: e.target.elements['pregunta1'].value,
            respuesta1Pregunta1: e.target.elements['respuesta1Pregunta1'].value,
            respuesta2Pregunta1: e.target.elements['respuesta2Pregunta1'].value,
            respuesta3Pregunta1: e.target.elements['respuesta3Pregunta1'].value,
            pregunta2: e.target.elements['pregunta2'].value,
            respuesta1Pregunta2: e.target.elements['respuesta1Pregunta2'].value,
            respuesta2Pregunta2: e.target.elements['respuesta2Pregunta2'].value,
            respuesta3Pregunta2: e.target.elements['respuesta3Pregunta2'].value,
            pregunta3: e.target.elements['pregunta3'].value,
            respuesta1Pregunta3: e.target.elements['respuesta1Pregunta3'].value,
            respuesta2Pregunta3: e.target.elements['respuesta2Pregunta3'].value,
            respuesta3Pregunta3: e.target.elements['respuesta3Pregunta3'].value,
        }
    );

    if (errors && Object.keys(errors).length > 0) {
        e.preventDefault()
        // Hay errores
        showErrorsForm(
            errors,
            e.target.elements['titulo'],
            e.target.elements['descripcion'],
            e.target.elements['fecha'],
            e.target.elements['fotos'],
            e.target.elements['direccion'],
            e.target.elements['provincia'],
            e.target.elements['localidad'],
            e.target.elements['radio'],
            e.target.elements['email'],
            e.target.elements['telefono'],
            e.target.elements['celular'],
            e.target.elements['palabrasClaves'],
            {
                pregunta1: e.target.elements['pregunta1'],
                respuesta1Pregunta1: e.target.elements['respuesta1Pregunta1'],
                respuesta2Pregunta1: e.target.elements['respuesta2Pregunta1'],
                respuesta3Pregunta1: e.target.elements['respuesta3Pregunta1'],
                pregunta2: e.target.elements['pregunta2'],
                respuesta1Pregunta2: e.target.elements['respuesta1Pregunta2'],
                respuesta2Pregunta2: e.target.elements['respuesta2Pregunta2'],
                respuesta3Pregunta2: e.target.elements['respuesta3Pregunta2'],
                pregunta3: e.target.elements['pregunta3'],
                respuesta1Pregunta3: e.target.elements['respuesta1Pregunta3'],
                respuesta2Pregunta3: e.target.elements['respuesta2Pregunta3'],
                respuesta3Pregunta3: e.target.elements['respuesta3Pregunta3'],
            }
        );
    }

    //No hay errores, se ejecuta la action

})

document.querySelector('#provincia').addEventListener("change", e => {
    fetch(`/localidades/${e.target.value}`, {
        headers:{
            "Content-Type": "application/json"
        }
    }).then((response)=> response.json())
    .then(data=>{
        const elementLocalidades= document.querySelector('#localidad')
        let options = elementLocalidades.getElementsByTagName('option');

        for (var i=options.length; i--;) {
            elementLocalidades.removeChild(options[i]);
        }
        data.forEach(localidad => {
            let opcion = document.createElement("option");
            opcion.text = localidad.Descripcion;
            opcion.value = localidad.IdLocalidad;
            elementLocalidades.add(opcion);
        });
    })
    .catch(error=>{
        alert("Ha ocurrido un error al obtener las localidades de esa provincia")
    })
})

function validarFormulario(titulo, tipoPublicacion, descripcion, fecha, fotos, direccion, provincia, localidad, latitud, longitud, radio, email, telefono, celular, palabrasClaves, preguntasSeguridad) {
    let errors = {};
    errors['titulo'] = [];
    errors['descripcion'] = [];
    errors['fecha'] = [];
    errors['fotos'] = [];
    errors['direccion'] = [];
    errors['provincia'] = [];
    errors['localidad'] = [];
    errors['radio'] = [];
    errors['email'] = [];
    errors['telefono'] = [];
    errors['celular'] = [];
    errors['palabrasClaves'] = [];
    errors['pregunta1'] = [];
    errors['respuesta1Pregunta1'] = [];
    errors['respuesta2Pregunta1'] = [];
    errors['respuesta3Pregunta1'] = [];
    errors['pregunta2'] = [];
    errors['respuesta1Pregunta2'] = [];
    errors['respuesta2Pregunta2'] = [];
    errors['respuesta3Pregunta2'] = [];
    errors['pregunta3'] = [];
    errors['respuesta1Pregunta3'] = [];
    errors['respuesta2Pregunta3'] = [];
    errors['respuesta3Pregunta3'] = [];
    let hasErrors = false;

    // Validacion campos

    /**
     * TITULO
     * - 100 caracteres maximo (Un promedio de algunas noticias o publicaciones que hemos visto)
     */
    if (titulo === "") {
        hasErrors = true;
        errors['titulo'].push('El titulo es requerido.');
    }

    if (titulo.length > 100) {
        hasErrors = true;
        errors['titulo'].push('El máximo de caracteres es de 100.');
    }

    /**
     * DESCRIPCION
     */

    if (descripcion === "") {
        hasErrors = true;
        errors['descripcion'].push('La descripcion es requerida.');
    }

    /**
     * FECHA
     */
    if (isNaN(Date.parse(fecha))) {
        hasErrors = true;
        errors['fecha'].push('La fecha es requerida.');
    }

    /**
     * FOTOS
     */
    if (fotos.length === 0 || fotos.length > 3) {
        hasErrors = true;
        errors['fotos'].push('Debe subir aunque sea una foto y como máximo 3.');
    }

    //DATOS DE UBICACION
    // Aca tambien vamos a poner el error de que debe localizar primero la direccion
    /**
     * DIRECCION
     * - 255 caracteres (solo porque es el default del tipo de campo en la base)
     */
    if (direccion === "") {
        hasErrors = true;
        errors['direccion'].push('La direccion es requerida.');
    }

    if (direccion.length > 255) {
        hasErrors = true;
        errors['direccion'].push('La direccion debe tener una longitud maxima de 255 caracteres');
    }

    if (latitud === "" || longitud === "") {
        hasErrors = true;
        errors['direccion'].push('Debe localizar la dirección antes de poder avanzar');
    }

    /**
     * Provincia
     * - Solo numeros, ya que se supone que los vamos a obtener de la BD
     */
     if (provincia === "-1") {
        hasErrors = true;
        errors['provincia'].push('La provincia es requerida');
    }

    if (isNaN(provincia)) {
        hasErrors = true;
        errors['provincia'].push('Ingrese una provincia valida');
    }

    /**
     * Localidad
     * - Solo numeros, ya que se supone que los vamos a obtener de la BD
     */
    if (localidad === "-1") {
        hasErrors = true;
        errors['localidad'].push('La localidad es requerida');
    }

    if (isNaN(localidad)) {
        hasErrors = true;
        errors['localidad'].push('Ingrese una localidad valida');
    }

    if (parseInt(tipoPublicacion) === TIPOS_PUBLICACION.PERDIDO) {
        /**
         * Localidad
         * - Solo numeros, ya que se supone que los vamos a obtener de la BD
         */
        if (radio === "") {
            hasErrors = true;
            errors['radio'].push('El radio es requerido');
        }
    
        if (isNaN(parseInt(radio))) {
            hasErrors = true;
            errors['radio'].push('Ingrese un radio válido. Debe ser entero');
        }
    }

    //DATOS DE CONTACTO
    //Debe ingresar al menos uno
    if (email !== "") {
        if (email.length > 100) {
            hasErrors = true;
            errors['email'].push('El correo electronico debe tener una longitud maxima de 100 caracteres');
        }
        if ((!email.match(MAIL_REGEX))) {
            hasErrors = true;
            errors['email'].push('Debe ingresar un correo electronico valido');
        }
    } else if (telefono !== "") {
        if (telefono.length > 10) {
            hasErrors = true;
            errors['telefono'].push('El telefono debe tener una longitud maxima de 10 caracteres');
        }
        if (isNaN(telefono)) {
            hasErrors = true;
            errors['telefono'].push('Ingrese solo numeros');
        }
    } else if (celular !== "") {
        if (celular.length > 10) {
            hasErrors = true;
            errors['celular'].push('El celular debe tener una longitud maxima de 10 caracteres');
        }
        if (isNaN(celular)) {
            hasErrors = true;
            errors['celular'].push('Ingrese solo numeros');
        }
    } else {
        hasErrors = true;
        errors['email'].push('Al menos uno de los datos de contacto es requerido');
        errors['telefono'].push('Al menos uno de los datos de contacto es requerido');
        errors['celular'].push('Al menos uno de los datos de contacto es requerido');
    }

    /**
     * Palabras claves
     *
     */
     if (palabrasClaves === "") {
        hasErrors = true;
        errors['palabrasClaves'].push('Las palabras claves son requeridas.');
    }

    /**
     * Preguntas de seguridad
     * - Todos los campos requeridos y con una longitud maxima de 255 caracteres
     * - Solo si es una publicacion del tipo encontrado
     */
    if (parseInt(tipoPublicacion) === TIPOS_PUBLICACION.ENCONTRADO) {
        Object.keys(preguntasSeguridad).forEach(prop => {
            if (preguntasSeguridad[prop] === "") {
                hasErrors = true;
                errors[prop].push('Este campo es requerido');
            }

            if (preguntasSeguridad[prop].length > 255) {
                hasErrors = true;
                errors[prop].push('Este campo debe tener una longitud maxima de 255 caracteres.');
            }
        })
    }

    // Fin de validaciones
    if (hasErrors) {
        return errors;
    } else {
        return {};
    }
}

function resetErrorsForm() {
    document.querySelectorAll('#formPublicacion .is-invalid').forEach(item => {
        item.classList.remove('is-invalid');
    })

    document.querySelectorAll('#formPublicacion .invalid-feedback').forEach(item => {
        item.innerHTML = '';
    })
}

function setMessageErrorInput(messages, el) {
    let elError = el.parentNode.querySelector('.invalid-feedback');
    let html = '';
    html += '<ul>';
    for (let msg of messages) {
        html += '<li>' + msg + '</li>';
    }
    html += '</ul>';
    elError.innerHTML = html;
}

function showErrorsForm(errors, titulo, descripcion, fecha, fotos, direccion, provincia, localidad, radio, email, telefono, celular, palabrasClaves, preguntasSeguridad) {
    // inputs and messages

    if (errors.titulo.length > 0) {
        setMessageErrorInput(errors.titulo, titulo);
        titulo.classList.add('is-invalid');
    }
    if (errors.descripcion.length > 0) {
        setMessageErrorInput(errors.descripcion, descripcion);
        descripcion.classList.add('is-invalid');
    }
    if (errors.fecha.length > 0) {
        setMessageErrorInput(errors.fecha, fecha);
        fecha.classList.add('is-invalid');
    }
    if (errors.fotos.length > 0) {
        setMessageErrorInput(errors.fotos, fotos);
        fotos.classList.add('is-invalid');
    }

    if (errors.direccion.length > 0) {
        setMessageErrorInput(errors.direccion, direccion);
        direccion.classList.add('is-invalid');
    }
    if (errors.provincia.length > 0) {
        setMessageErrorInput(errors.provincia, provincia);
        provincia.classList.add('is-invalid');
    }
    if (errors.localidad.length > 0) {
        setMessageErrorInput(errors.localidad, localidad);
        localidad.classList.add('is-invalid');
    }
    if (errors.radio.length > 0) {
        setMessageErrorInput(errors.radio, radio);
        radio.classList.add('is-invalid');
    }
    if (errors.email.length > 0) {
        setMessageErrorInput(errors.email, email);
        email.classList.add('is-invalid');
    }
    if (errors.telefono.length > 0) {
        setMessageErrorInput(errors.telefono, telefono);
        telefono.classList.add('is-invalid');
    }
    if (errors.celular.length > 0) {
        setMessageErrorInput(errors.celular, celular);
        celular.classList.add('is-invalid');
    }
    if (errors.palabrasClaves.length > 0) {
        setMessageErrorInput(errors.palabrasClaves, palabrasClaves);
        palabrasClaves.classList.add('is-invalid');
    }
    Object.keys(preguntasSeguridad).forEach(prop => {
        if (errors[prop].length > 0) {
            setMessageErrorInput(errors[prop], preguntasSeguridad[prop]);
            preguntasSeguridad[prop].classList.add('is-invalid');
        }
    })
}


