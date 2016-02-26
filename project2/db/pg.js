'use strict'

var db             = require('./db/pg.js');
var pg             = require('pg');
var path           = require('path');
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var session        = require('express-session');
var pgSession      = require('connect-pg-simple')(session);

dotenv.load();

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('short'));
app.use(express.static('./public'));
app.use(methodOverride('_method'));
app.use(session({
 store: new pgSession({
   pg: pg,
   conString: connectionString,
   tablename: 'session'
 }),
 secret : 'porzingod',
 resave : false,
 cookie : { maxAge : 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  console.log('we good');
});





var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('server initialized');
});
