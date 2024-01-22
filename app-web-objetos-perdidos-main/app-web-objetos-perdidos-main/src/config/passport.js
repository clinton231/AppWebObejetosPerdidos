/*  Google AUTH  */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Usuario = require('../models/Usuario');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  async function (accessToken, refreshToken, profile, done) {
    let usuarioDB= await Usuario.findByEmail(profile._json.email)
    if(!usuarioDB){
      usuarioDB= new Usuario({
        Email: profile._json.email,
        NombreApellido:  profile._json.name,
        UrlFoto:  profile._json.picture,
      })
      await usuarioDB.save()
    }
    return done(null, usuarioDB);
  }
));

module.exports = passport;
