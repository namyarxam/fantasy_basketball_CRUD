'use strict'

var pg      = require('pg');
var bcrypt  = require('bcrypt');
var salt    = bcrypt.genSaltSync(10);
var session = require('express-session');

var config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
}

/*SESSIONS STUFF*/
function loginUser(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  pg.connect(config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    var query = client.query("SELECT * FROM users where email LIKE ($1);",
                [email],
                function(err, results) {
                  done();
                  if(err) {
                    return console.error('error, running query', err);
                  }
                  if (results.rows.length === 0) {
                    res.status(204).json({ success: true, data: 'no content'});
                  } else if (bcrypt.compareSync(password, results.rows[0].password_digest)) {
                    res.rows = results.rows[0];
                    next();
                  }
                });
  });
}

function createSecure(email, password, callback) {
  bcrypt.genSalt(function(err, salt) {
   bcrypt.hash(password, salt, function(err, hash) {
     callback(email, hash);
   });
  });
}

function createUser(req, res, next) {
  createSecure(req.body.email, req.body.password, saveUser);

  function saveUser(email, hash) {
    pg.connect(config, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({ success: false, data: err});
      }
      var query = client.query("INSERT INTO users (email, password_digest) VALUES($1, $2);",
                  [email, hash],
                  function(err, results) {
                    done();
                    if(err) {
                      return console.error('error, running query', err);
                    }
                    next();
                  });
    });
  }
}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
