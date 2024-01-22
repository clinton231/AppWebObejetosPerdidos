const express = require('express')
const path = require('path')
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const flash = require('connect-flash');
var moment = require('moment');
dotenv.config();

const port = process.env.PORT || 3000
const app = express()

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'SECRET',
}));

// setup forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


/*  PASSPORT SETUP  */
app.use(passport.initialize());
app.use(passport.session());

// middlewares
const { authUserMiddleware } = require('./middlewares/auth');
app.use(authUserMiddleware);

app.use(flash());
const { flashMiddleware, flashHelpersMiddleware } = require('./middlewares/flash');
app.use(flashMiddleware);
app.use(flashHelpersMiddleware);

// public files
app.use(express.static(path.join(__dirname, './public')));

// routes
app.use('/', require('./routes/private'));
app.use('/', require('./routes/public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


app.locals.moment = moment;
