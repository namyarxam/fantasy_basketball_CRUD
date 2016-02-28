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
/*GET BUDGET*/
function getBudget(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json( {success: false, data: err} );
    }
    client.query('SELECT budget FROM teams WHERE teamid = $1', [req.params.id], (err, results) => {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.budget = results.rows;
      next();
    });
  });
}

/*GET LIST OF TEAMS*/
function getTeams(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json( {success: false, data: err} );
    }
    client.query('SELECT * FROM teams', (err, results) => {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.rows = results.rows;
      next();
    });
  });
}

/*ADD TEAM TO teams*/
function addTeam(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json( {success: false, data:err })
    }
    client.query('INSERT INTO teams (name, budget) VALUES ($1, 150)',
                              [req.body.name],
                              function(err, results) {
                                if(err) {
                                  return console.error('error running query', err);
                                }
                                next();
                              });
  });
}

function addDefaultPlayers(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json( {success: false, data:err })
    }
    client.query('SELECT COUNT(teamid) FROM teams_players WHERE teamid = ($1)',
                              [req.params.id],
                              function(err, results) {
                                if(err) {
                                  return console.error('error running query', err);
                                }
                                if(results.rows[0].count > 1) {
                                  next();
                                } else {
                                  client.query('INSERT INTO teams_players (teamid, playerid) VALUES ($1, 152), ($1, 153), ($1, 154), ($1, 155), ($1, 156)',
                                  [req.params.id],
                                  function(err, results) {
                                    if(err) {
                                      return console.error('error running query', err);
                                    }
                                    next();
                                  });
                                }
                              });
  });
}

function getPlayersEditPage(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json( {success: false, data:err })
    }
    client.query('SELECT * FROM players INNER JOIN teams_players ON players.playerid = teams_players.playerid WHERE teams_players.teamid = ($1) ORDER BY position', [req.params.id], (err, results) => {
      if(err) {
        return console.error('error running query', err);
      }
      res.rows = results.rows;
      next();
    });
  });
}

function deleteTeam(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json( {success: false, data:err })
    }
    client.query('DELETE FROM teams_players WHERE teamid = ($1)',
                              [req.body.id],
                              function(err, results) {
                                if(err) {
                                  return console.error('error running query', err);
                                }
                                next();
                              });
    client.query('DELETE FROM teams WHERE teamid = ($1)',
                              [req.body.id],
                              function(err, results) {
                                if(err) {
                                  return console.error('error running query', err);
                                }
                                next();
                              });
  });
}

/*GET PLAYERS BY POSITION W/ BUDGET CONSTRAINT*/
function getPlayersByPosBudget(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json( {success: false, data: err} );
    }
    client.query('SELECT * FROM players WHERE position = ($1) ORDER BY price desc', [(req.params.pos).toUpperCase()], (err, results) => {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.rows = results.rows;
      next();
    });
  });
}

function addPlayerToTeam(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json( {success: false, data: err} );
    }

    client.query('UPDATE teams_players SET playerid = ($1) WHERE playerid = (SELECT teams_players.playerid FROM teams_players INNER JOIN players ON players.playerid = teams_players.playerid where players.position = ($2) AND teams_players.teamid = ($3))', [req.body.playerid, (req.params.pos).toUpperCase(), req.params.id], (err, results) => {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.rows = results.rows;
      next();
    });
  });
}

function showPlayerOnTeamByPos(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json( {success: false, data: err} );
    }
    console.log((req.params.pos).toUpperCase);
    client.query('SELECT players.name, players.position, players.ppg, players.img_url FROM players INNER JOIN teams_players ON players.playerid = teams_players.playerid INNER JOIN teams ON teams_players.teamid = teams.teamid WHERE teams.teamid = ($1) AND players.position = ($2)',[req.params.id, (req.params.pos).toUpperCase()], (err, results) => {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      console.log(results.rows);
      res.rows = results.rows;
      next();
    });
  });
}


module.exports.getBudget = getBudget;
module.exports.getPlayersEditPage = getPlayersEditPage;
module.exports.addDefaultPlayers = addDefaultPlayers;
module.exports.showPlayerOnTeamByPos = showPlayerOnTeamByPos;
module.exports.addPlayerToTeam = addPlayerToTeam;
module.exports.deleteTeam = deleteTeam;
module.exports.getTeams = getTeams;
module.exports.addTeam = addTeam;
module.exports.getPlayersByPosBudget = getPlayersByPosBudget;
