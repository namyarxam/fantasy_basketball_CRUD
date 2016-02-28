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

/*SHOW PLAYERS*/
function showPlayers(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json( {success: false, data: err} );
    }
    client.query('SELECT name, position, ppg, img_url FROM players ORDER BY ppg DESC', (err, results) => {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.rows = results.rows;
      next();
    });
  });
}






module.exports.showPlayers = showPlayers;
