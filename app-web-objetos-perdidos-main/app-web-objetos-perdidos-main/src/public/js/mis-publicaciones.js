const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

document.querySelectorAll('[data-finalizar-publicacion]').forEach(el => {
    el.addEventListener("click", (event) => {
        const formFinalizar=document.getElementById("formFinalizar")
        formFinalizar.elements['idPublicacion'].value=el.attributes['data-finalizar-publicacion'].value

        const modalFinalizar = new bootstrap.Modal('#modalFinalizar', {
            keyboard: false
        })
        modalFinalizar.show()
    })
})

document.querySelectorAll('[data-eliminar-publicacion]').forEach(el => {
    el.addEventListener("click", (event) => {

        const formEliminar=document.getElementById("formEliminar")
        formEliminar.elements['idPublicacion'].value=el.attributes['data-eliminar-publicacion'].value

        const modalEliminar = new bootstrap.Modal('#modalEliminar', {
            keyboard: false
        })
        modalEliminar.show()
    })
})

document.querySelectorAll('input[name="tipoPublicacion"]').forEach(element => {
    element.addEventListener("click", (event) => {
        if (parseInt(event.target.value) === TIPOS_PUBLICACION.PERDIDO) {
            window.location.href = "/mis-publicaciones?tipo="+TIPOS_PUBLICACION.PERDIDO
        } else {
            //ENCONTRADO
            window.location.href = "/mis-publicaciones?tipo="+TIPOS_PUBLICACION.ENCONTRADO
        }
    })
})