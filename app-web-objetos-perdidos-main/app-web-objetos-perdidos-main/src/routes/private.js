const express = require('express')
const { validationResult } = require('express-validator');
const nuevaPublicacionCheck = require('../validators/validator-publicacion')
const { isAuthenticated } = require('../middlewares/auth');
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const pool = require('../config/db')

const Publicacion = require('./../models/Publicacion')
const PreguntaSeguridad = require('./../models/PreguntaSeguridad')
const RespuestaSeguridad = require('./../models/RespuestaSeguridad')
const Localidad = require('./../models/Localidad')
const TipoPublicacion = require('./../models/TipoPublicacion')
const FotoPublicacion = require('./../models/FotoPublicacion')
const Provincia = require('./../models/Provincia');
const PosibleDuenio = require('../models/PosibleDuenio');

const router = express.Router();

router.get("/logout", isAuthenticated, (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session = null;
        res.redirect('/');
    });

})

router.get('/nueva', isAuthenticated, async (req, res) => {
    let provincias = await Provincia.getAll();
    res.render('crear-publicacion', {
        provincias
    });
});

router.post('/nueva', isAuthenticated, upload.array("fotos", 3), nuevaPublicacionCheck(), async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        req.flash('formData', req.body)
        res.redirect("/nueva")
    } else {
        let otherErrors = []
        // Validamos que exista la localidad
        let localidad = await Localidad.findById(req.body.localidad)

        if (!localidad) {
            otherErrors.push({
                msg: 'La localidad ingresada es incorrecta',
                param: 'localidad',
            })
        }

        if (req.files?.length > 3 || req.files?.length < 1) {
            otherErrors.push({
                msg: 'Debe ingresar aunque sea una foto y no mas que 3.',
                param: 'fotos',
            })
        }

        if (otherErrors.length > 0) {
            req.flash('errors', otherErrors);
            req.flash('formData', req.body)
            res.redirect("/nueva")
        } else {
            //USAMOS TRANSACCIONES
            let connection = await pool.getConnection()
            await connection.beginTransaction()

            try {
                //Primero la publicacion y sus datos de ubicacion (lo hacemos en el mismo modelo por ser 1:1 LA RELACION)
                const publicacion = new Publicacion({
                    Titulo: req.body.titulo,
                    IdTipoPublicacion: req.body.tipoPublicacion,
                    Descripcion: req.body.descripcion,
                    Fecha: req.body.fecha,
                    Telefono: req.body.telefono,
                    Celular: req.body.celular,
                    Email: req.body.email,
                    PalabrasClaves: req.body.palabrasClaves,
                    OfreceRecompensa: req.body.ofreceRecompensa ? true : false,
                    IdUsuario: req.user.IdUsuario,
                    DatosUbicacion: {
                        Direccion: req.body.direccion,
                        IdLocalidad: req.body.localidad,
                        Latitud: req.body.latitud,
                        Longitud: req.body.longitud,
                        Radio: req.body.radio || null,
                    }
                })
                await publicacion.save(connection)

                //LAS TABLAS SIGUIENTES VAN CONTRA SU PROPIO MODELO POR SER RELACION 1:N
                //GUARDAMOS LAS FOTOS
                req.files.forEach(async element => {
                    const photoBuffer = element.buffer
                    const base64Photo = Buffer.from(photoBuffer).toString('base64')
                    const fotoPublicacion = new FotoPublicacion({
                        IdPublicacion: publicacion.Id,
                        Archivo: base64Photo
                    })
                    await fotoPublicacion.save(connection)
                });

                //GUARDAMOS LAS PREGUNTAS SI ES NECESARIO
                if (publicacion.IdTipoPublicacion.toString() === TipoPublicacion.ENCONTRADO.toString()) {
                    //PREGUNTA 1
                    let pregunta1 = new PreguntaSeguridad({
                        IdPublicacion: publicacion.Id,
                        Descripcion: req.body.pregunta1
                    })
                    await pregunta1.save(connection)

                    let respuesta1Pregunta1 = new RespuestaSeguridad({
                        IdPregunta: pregunta1.IdPregunta,
                        Descripcion: req.body.respuesta1Pregunta1,
                        Correcta: req.body.respuestaCorrectaPregunta1 === "1"
                    })
                    await respuesta1Pregunta1.save(connection)

                    let respuesta2Pregunta1 = new RespuestaSeguridad({
                        IdPregunta: pregunta1.IdPregunta,
                        Descripcion: req.body.respuesta2Pregunta1,
                        Correcta: req.body.respuestaCorrectaPregunta1 === "2"
                    })
                    await respuesta2Pregunta1.save(connection)

                    let respuesta3Pregunta1 = new RespuestaSeguridad({
                        IdPregunta: pregunta1.IdPregunta,
                        Descripcion: req.body.respuesta3Pregunta1,
                        Correcta: req.body.respuestaCorrectaPregunta1 === "3"
                    })
                    await respuesta3Pregunta1.save(connection)

                    //PREGUNTA 2
                    let pregunta2 = new PreguntaSeguridad({
                        IdPublicacion: publicacion.Id,
                        Descripcion: req.body.pregunta2
                    })
                    await pregunta2.save(connection)

                    let respuesta1Pregunta2 = new RespuestaSeguridad({
                        IdPregunta: pregunta2.IdPregunta,
                        Descripcion: req.body.respuesta1Pregunta2,
                        Correcta: req.body.respuestaCorrectaPregunta2 === "1"
                    })
                    await respuesta1Pregunta2.save(connection)

                    let respuesta2Pregunta2 = new RespuestaSeguridad({
                        IdPregunta: pregunta2.IdPregunta,
                        Descripcion: req.body.respuesta2Pregunta2,
                        Correcta: req.body.respuestaCorrectaPregunta2 === "2"
                    })
                    await respuesta2Pregunta2.save(connection)

                    let respuesta3Pregunta2 = new RespuestaSeguridad({
                        IdPregunta: pregunta2.IdPregunta,
                        Descripcion: req.body.respuesta3Pregunta2,
                        Correcta: req.body.respuestaCorrectaPregunta2 === "3"
                    })
                    await respuesta3Pregunta2.save(connection)

                    //PREGUNTA 3
                    let pregunta3 = new PreguntaSeguridad({
                        IdPublicacion: publicacion.Id,
                        Descripcion: req.body.pregunta3
                    })
                    await pregunta3.save(connection)

                    let respuesta1Pregunta3 = new RespuestaSeguridad({
                        IdPregunta: pregunta3.IdPregunta,
                        Descripcion: req.body.respuesta1Pregunta3,
                        Correcta: req.body.respuestaCorrectaPregunta3 === "1"
                    })
                    await respuesta1Pregunta3.save(connection)

                    let respuesta2Pregunta3 = new RespuestaSeguridad({
                        IdPregunta: pregunta3.IdPregunta,
                        Descripcion: req.body.respuesta2Pregunta3,
                        Correcta: req.body.respuestaCorrectaPregunta3 === "2"
                    })
                    await respuesta2Pregunta3.save(connection)

                    let respuesta3Pregunta3 = new RespuestaSeguridad({
                        IdPregunta: pregunta3.IdPregunta,
                        Descripcion: req.body.respuesta3Pregunta3,
                        Correcta: req.body.respuestaCorrectaPregunta3 === "3"
                    })
                    await respuesta3Pregunta3.save(connection)
                }

                await connection.commit()

                req.flash('success', ['Publicación guardada correctamente']);
                res.redirect('mis-publicaciones');

            } catch (error) {
                await connection.rollback()
                console.log(error)

                req.flash('errors', [{
                    msg: 'No se pudo guardar la publicación. Intente nuevamente',
                }]);
                req.flash('formData', req.body)
                res.redirect("/nueva")
            } finally {
                connection.release()
            }
        }
    }
});

router.get('/mis-publicaciones', isAuthenticated, async (req, res) => {
    let tipo = req.query.tipo || TipoPublicacion.PERDIDO
    let misPublicaciones = await Publicacion.getAllByUser(req.user.IdUsuario, tipo)
    res.render('mis-publicaciones', {
        publicaciones: misPublicaciones,
        tipo
    });
});

router.post('/eliminar-publicacion', isAuthenticated, async (req, res) => {
    let publicacion = await Publicacion.getById(req.body.idPublicacion)
    if (!publicacion || publicacion.FechaDeBaja !== null) {
        req.flash('danger', [
            'No existe la publicación o la misma esta dada de baja',
        ]);
        res.redirect("/mis-publicaciones");
    } else {
        await publicacion.delete()
        req.flash('success', ['Publicación eliminada correctamente']);
        res.redirect("/mis-publicaciones");
    }
});

router.post('/finalizar-publicacion', isAuthenticated, async (req, res) => {
    let publicacion = await Publicacion.getById(req.body.idPublicacion)
    if (!publicacion || publicacion.Resuelta) {
        req.flash('danger', ['No existe la publicación o la misma esta dada de baja']);
        res.redirect("/mis-publicaciones");
    } else {
        await publicacion.finalizar()
        req.flash('success', ['Publicación finalizada correctamente']);
        res.redirect("/mis-publicaciones");
    }
});

router.post('/validar-preguntas/:idPublicacion', isAuthenticated, async (req, res) => {
    let publicacion = await Publicacion.getById(req.params.idPublicacion)
    if (!publicacion || publicacion.Resuelta || publicacion.FechaDeBaja != null) {
        req.flash('danger', ['No existe la publicación o la misma esta dada de baja o resuelta']);
        res.redirect(`/detalle/${req.params.idPublicacion}`);
    } else {
        //Buscamos si ya existe, ya que no podria volver a validar las preguntas
        let posibleDuenio= await PosibleDuenio.getByUserAndPublicacion(req.user.IdUsuario, req.params.idPublicacion)
        if(posibleDuenio !== null){
            req.flash('danger', ['El usuario ya ha respondido las preguntas de esta publicación']);
            res.redirect(`/detalle/${req.params.idPublicacion}`);
        }else{
            //obtenemos las preguntas y la respuesta correcta
            let pregunta1= publicacion.PreguntasSeguridad.find(x=>x.IdPregunta == req.body.pregunta1)
            let pregunta2= publicacion.PreguntasSeguridad.find(x=>x.IdPregunta == req.body.pregunta2)
            let pregunta3= publicacion.PreguntasSeguridad.find(x=>x.IdPregunta == req.body.pregunta3)
            if(!pregunta1 || !pregunta2 || !pregunta3){
                req.flash('danger', ['Alguna de las preguntas que desea validar no existen']);
                res.redirect(`/detalle/${req.params.idPublicacion}`);
            }else{
                let pregunta1Correcta=pregunta1.RespuestasSeguridad.find(x=>x.IdRespuesta == req.body.respuestaCorrectaPregunta1).Correcta
                let pregunta2Correcta=pregunta2.RespuestasSeguridad.find(x=>x.IdRespuesta == req.body.respuestaCorrectaPregunta2).Correcta
                let pregunta3Correcta=pregunta3.RespuestasSeguridad.find(x=>x.IdRespuesta == req.body.respuestaCorrectaPregunta3).Correcta
                //creamos el objeto de posible duenio
                posibleDuenio=new PosibleDuenio({
                    IdPublicacion:req.params.idPublicacion,
                    IdUsuario:req.user.IdUsuario,
                })
                
                if(pregunta1Correcta && pregunta2Correcta && pregunta3Correcta){
                    posibleDuenio.ValidadoCorrectamente=true;
                    await posibleDuenio.save()

                    req.flash('success', ['Preguntas validadas correctamente']);
                    res.redirect(`/detalle/${req.params.idPublicacion}`);
                }else{
                    posibleDuenio.ValidadoCorrectamente=false;
                    await posibleDuenio.save()

                    req.flash('danger', ['Preguntas validadas incorrectamente']);
                    res.redirect(`/detalle/${req.params.idPublicacion}`);
                }
            }
        }
    }
});

module.exports = router;