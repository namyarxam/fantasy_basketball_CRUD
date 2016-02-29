var express    = require('express');
var bodyParser = require('body-parser');
var db         = require('./../db/pg-users');
var users      = express.Router();

users.post('/login', db.loginUser, function(req, res) {
  req.session.user = res.rows;

  req.session.save(function() {
    res.redirect('/');
  });
});

users.delete('/logout', function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  })
});

users.post('/', db.createUser, function(req, res) {
  res.redirect('/users');
});

users.get('/', function(req, res) {
  res.render('pages/login.html.ejs', { user: req.session.user });
});


module.exports = users;
