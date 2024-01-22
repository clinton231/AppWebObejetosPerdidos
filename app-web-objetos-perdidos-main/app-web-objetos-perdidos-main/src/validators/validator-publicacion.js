const { body, req } = require('express-validator')
const TipoPublicacion = require('./../models/TipoPublicacion')

const nuevaPublicacionCheck = () => {
    return [
        body('titulo').not().isEmpty().withMessage("El titulo es requerido").isLength({ min: 1, max: 100 }).withMessage("El titulo debe tener maximo 100 caracteres"),
        body('descripcion').not().isEmpty().withMessage("La descripcion es requerida"),
        body('fecha').not().isEmpty().withMessage("La fecha es requerida").isDate().withMessage("Debe ingresar una fecha en un formato valido"),
        body('direccion').not().isEmpty().withMessage("La direccion es requerida").isLength({ min: 1, max: 255 }).withMessage("La direccion debe tener maximo 255 caracteres"),
        body('provincia').not().isEmpty().withMessage("La provincia es requerida").isInt().withMessage("Ingrese una provincia válida"),
        body('localidad').not().isEmpty().withMessage("La localidad es requerida").isInt().withMessage("Ingrese una localidad válida"),
        body('radio').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.PERDIDO);
        }).not().isEmpty().withMessage("El radio es requerido").isInt().withMessage("Ingrese un valor valido para el radio"),
        body('email').if((value, { req }) => { 
            return (req.body.telefono === "" && req.body.celular === "");
        }).not().isEmpty().withMessage("Al menos uno de los datos de contacto es requerido").isEmail().withMessage("Ingrese un correo electronico valido"),
        body('telefono').if((value, { req }) => { 
            return (req.body.email === "" && req.body.celular === "");
        }).not().isEmpty().withMessage("Al menos uno de los datos de contacto es requerido").isInt({ min: 1000000000, max: 9999999999 }).withMessage("El telefono debe tener una longitud maxima de 10 caracteres"),
        body('celular').if((value, { req }) => { 
            return (req.body.email === "" && req.body.telefono === "");
        }).not().isEmpty().withMessage("Al menos uno de los datos de contacto es requerido").isInt({ min: 1000000000, max: 9999999999 }).withMessage("El celular debe tener una longitud maxima de 10 caracteres"),
        body('tipoPublicacion').not().isEmpty().withMessage("El tipo de publicacion es requerida").isIn([TipoPublicacion.ENCONTRADO.toString(), TipoPublicacion.PERDIDO.toString()]).withMessage("Debe ingresar un tipo de publicacion válido"),
        body('palabrasClaves').not().isEmpty().withMessage("Las palabras claves son requeridas"),
        //VALIDAMOS LAS PREGUNTAS
        body('pregunta1').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.ENCONTRADO);
        }).not().isEmpty().withMessage("La pregunta 1 es requerida").isLength({ min: 1, max: 255 }).withMessage("La pregunta 1 debe tener maximo 255 caracteres"),
        body('respuesta1Pregunta1').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.ENCONTRADO);
        }).not().isEmpty().withMessage("La respuesta 1 de la pregunta 1 es requerida").isLength({ min: 1, max: 255 }).withMessage("La respuesta 1 de la pregunta 1 debe tener maximo 255 caracteres"),
        body('respuesta2Pregunta1').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.ENCONTRADO);
        }).not().isEmpty().withMessage("La respuesta 2 de la pregunta 1 es requerida").isLength({ min: 1, max: 255 }).withMessage("La respuesta 2 de la pregunta 1 debe tener maximo 255 caracteres"),
        body('respuesta3Pregunta1').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.ENCONTRADO);
        }).not().isEmpty().withMessage("La respuesta 3 de la pregunta 1 es requerida").isLength({ min: 1, max: 255 }).withMessage("La respuesta 3 de la pregunta 1 debe tener maximo 255 caracteres"),
        //PREGUNTA 2
        body('pregunta2').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.ENCONTRADO);
        }).not().isEmpty().withMessage("La pregunta 2 es requerida").isLength({ min: 1, max: 255 }).withMessage("La pregunta 2 debe tener maximo 255 caracteres"),
        body('respuesta1Pregunta2').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.ENCONTRADO);
        }).not().isEmpty().withMessage("La respuesta 1 de la pregunta 2 es requerida").isLength({ min: 1, max: 255 }).withMessage("La respuesta 1 de la pregunta 2 debe tener maximo 255 caracteres"),
        body('respuesta2Pregunta2').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.ENCONTRADO);
        }).not().isEmpty().withMessage("La respuesta 2 de la pregunta 2 es requerida").isLength({ min: 1, max: 255 }).withMessage("La respuesta 2 de la pregunta 2 debe tener maximo 255 caracteres"),
        body('respuesta3Pregunta2').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.ENCONTRADO);
        }).not().isEmpty().withMessage("La respuesta 3 de la pregunta 2 es requerida").isLength({ min: 1, max: 255 }).withMessage("La respuesta 3 de la pregunta 2 debe tener maximo 255 caracteres"),
        //PREGUNTA 3
        body('pregunta3').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.ENCONTRADO);
        }).not().isEmpty().withMessage("La pregunta 3 es requerida").isLength({ min: 1, max: 255 }).withMessage("La pregunta 3 debe tener maximo 255 caracteres"),
        body('respuesta1Pregunta3').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.ENCONTRADO);
        }).not().isEmpty().withMessage("La respuesta 1 de la pregunta 3 es requerida").isLength({ min: 1, max: 255 }).withMessage("La respuesta 1 de la pregunta 3 debe tener maximo 255 caracteres"),
        body('respuesta2Pregunta3').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.ENCONTRADO);
        }).not().isEmpty().withMessage("La respuesta 2 de la pregunta 3 es requerida").isLength({ min: 1, max: 255 }).withMessage("La respuesta 2 de la pregunta 3 debe tener maximo 255 caracteres"),
        body('respuesta3Pregunta3').if((value, { req }) => { 
            return (parseInt(req.body.tipoPublicacion) === TipoPublicacion.ENCONTRADO);
        }).not().isEmpty().withMessage("La respuesta 3 de la pregunta 3 es requerida").isLength({ min: 1, max: 255 }).withMessage("La respuesta 3 de la pregunta 3 debe tener maximo 255 caracteres"),
    ]
}

module.exports = nuevaPublicacionCheck;
