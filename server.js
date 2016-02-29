'use strict'

/*global require __dirname process*/

if(!process.env.NODE_ENV) {
  require('dotenv').config();
}

var db               = require('./db/pg-users.js');
var pg               = require('pg');
var path             = require('path');
var express          = require('express');
var morgan           = require('morgan');
var bodyParser       = require('body-parser');
var methodOverride   = require('method-override');
var session          = require('express-session');
var pgSession        = require('connect-pg-simple')(session);
var teamRoutes       = require( path.join(__dirname, 'routes', 'teams'));
var playerRoutes     = require( path.join(__dirname, 'routes', 'players'));
var userRoutes       = require( path.join(__dirname, 'routes', 'users'));

var app = express();

var config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
}

/*different logging for development / production*/
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('commmon'));
}

app.use(session({
 store: new pgSession({
   pg: pg,
   conString: config,
   tablename: 'session'
 }),
 secret : 'porzingod',
 resave : false,
 cookie : { maxAge : 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.use(methodOverride('_method'));


app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res)=> {
  res.render('pages/home.html.ejs', { user: req.session.user });
});


app.use('/teams', teamRoutes);
app.use('/players', playerRoutes);
app.use('/users', userRoutes);





var port = process.env.PORT || 3000;
var server = app.listen(port, ()=> {console.log(`Listening on port ${process.env.PORT} // ` + new Date())});
