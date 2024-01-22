const Usuario = require('../models/Usuario');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};

const authUserMiddleware = async (req, res, next) => {
    if (req.session && req.session.passport) {
        let userLogged = await Usuario.findByEmail(req.session.passport.user.Email);
        res.locals.userLogged = userLogged;
    }
    next();
}

module.exports = {
    isAuthenticated,
    authUserMiddleware,
};
