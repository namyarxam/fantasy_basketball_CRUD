'use strict'

var express    = require('express');
var teams      = express.Router();
var bodyParser = require('body-parser');
var session    = require('express-session')
var db         = require('./../db/pg-teams');


// point calculation algorithm, average DFG% is 44.9%
function points(ppg, dfg) {
  var low  = Math.ceil(ppg * 0.5);
  var defended = Math.round(dfg-44.9);
  var high = Math.ceil(ppg * 1.5)+defended;
  var defended = Math.round(dfg-44.9);
  var scored = Math.round(Math.random()*high);

  if(dfg > 44.9) low+=defended;
  if(scored < low) scored+=low;
  if(scored < 0) scored = 0;
  if(scored > high) scored = high;

  var result = [low, high, scored];
  return result;
}

// teams.use((req, res, next)=> {
//   if (req.session.user) {
//     next();
//   } else {
//     res.status(401).json({ succes: false, data: 'not logged in' });
//   }
// });

teams.route('/')
  .get( db.getTeams, (req, res) => {
    res.render('pages/teams.html.ejs', { user: req.session.user, teams: res.rows } );
  })
  .post( db.addTeam, (req, res) => {
    res.redirect('/teams');
  })

teams.route('/new')
  .get( (req, res) => {
    res.render('pages/new_team.html.ejs', { user: req.session.user });
  })

teams.route('/:id')
  .delete( db.deleteTeam, (req, res) => {
    res.redirect('/teams');
  })

teams.route('/:id/edit')
  .get( db.getBudget, db.addDefaultPlayers, db.getPlayersEditPage, (req, res) => {
    var id = req.params.id;

    res.render('pages/edit_team.html.ejs', { user: req.session.user, budget: res.budget, playerList: res.rows, id: id});
  })
  .post( db.resetPlayer, db.revertBudget, (req, res) => {
    var id = req.params.id;

    res.redirect('/teams/' + id + '/edit');
  })

teams.route('/:id/:pos/edit')
  .get( db.getBudget, db.getPlayersByPosBudget, (req, res) => {
    var pos = req.params.pos;
    var id = req.params.id;

    res.render('pages/pos_list.html.ejs', { user: req.session.user, budget: res.budget, playerList: res.rows, position: pos, id: id })
  })

teams.route('/:id/:pos')
  .get( db.showPlayerOnTeamByPos, (req, res) => {
    var id = req.params.id;

    res.render('pages/team_player.html.ejs', { user: req.session.user, playerInfo: res.rows, teamID: id });
  })
  .post( db.addPlayerToTeam, db.editBudget, (req, res) => {
    var pos = req.params.pos;
    var id = req.params.id;

    res.redirect('/teams/' + id + '/' + pos);
  })

teams.get('/battle', db.getTeams, (req, res) => {
  res.render('pages/team_battle.html.ejs', { user: req.session.user, teams: res.rows } );
})





module.exports = teams;
