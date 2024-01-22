const express = require('express')
const passport = require('../config/passport');
const { isAuthenticated } = require('../middlewares/auth');
const PosibleDuenio = require('../models/PosibleDuenio');
const Provincia = require('../models/Provincia');
const Publicacion = require('../models/Publicacion');
const TipoPublicacion = require('../models/TipoPublicacion');

const router = express.Router();

const Localidad = require('./../models/Localidad')

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function (req, res) {
    // Successful authentication, redirect success.
    res.redirect('/');
});

router.get('/', async (req, res) => {
    let tipo = req.query.tipo || TipoPublicacion.PERDIDO

    let provincias = await Provincia.getAll();

    let publicaciones = await Publicacion.getAll(tipo, req.query.titulo, req.query.palabrasClaves, req.query.fechaDesde, req.query.fechaHasta, req.query.provincia, req.query.localidad, req.query.ofreceRecompensa)
    
    res.render('inicio', {
        publicaciones,
        tipo,
        provincias,
        parametrosBusqueda: {
            titulo: req.query.titulo,
            palabrasClaves: req.query.palabrasClaves,
            fechaDesde: req.query.fechaDesde,
            fechaHasta: req.query.fechaHasta,
            provincia: req.query.provincia,
            localidad: req.query.localidad,
            ofreceRecompensa: req.query.ofreceRecompensa
        }
    });
});

router.get('/detalle/:idPublicacion', async (req, res) => {
    const publicacion = await Publicacion.getById(req.params.idPublicacion)
    if (!publicacion || publicacion.FechaDeBaja !== null) {
        req.flash('danger', [
            'No existe la publicación o la misma esta dada de baja',
        ]);
        res.redirect("/");
    } else {
        let validadoCorrectamente=false
        if(req.isAuthenticated()){
            let posibleDuenio= await PosibleDuenio.getByUserAndPublicacion(req.user.IdUsuario, req.params.idPublicacion)
            validadoCorrectamente= posibleDuenio?.ValidadoCorrectamente
        }
        res.render('detalle-publicacion', {
            publicacion,
            idTipoPublicacionPerdido: TipoPublicacion.PERDIDO,
            validadoCorrectamente
        });
    }
});


//DATOS generales
router.get('/localidades/:provincia', async (req, res) => {
    let localidades = await Localidad.getAllByProvincia(req.params.provincia)
    res.json(localidades)
});

//ubicaciones
router.get('/publicaciones-ubicaciones', async (req, res) => {
    
    let tipo = req.query.tipo || TipoPublicacion.PERDIDO
    let ubicaciones = await Publicacion.getAll(tipo, req.query.titulo, req.query.palabrasClaves, req.query.fechaDesde, req.query.fechaHasta, req.query.provincia, req.query.localidad, req.query.ofreceRecompensa)
    res.json(ubicaciones)
});

module.exports = router;