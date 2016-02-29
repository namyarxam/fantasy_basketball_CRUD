'use strict'

var express    = require('express');
var players    = express.Router();
var bodyParser = require('body-parser');
var session    = require('express-session')
var db         = require('./../db/pg-players');

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

// players.use((req, res, next)=> {
//   if (req.session.user) {
//     next();
//   } else {
//     res.status(401).json({ succes: false, data: 'not logged in' });
//   }
// });

players.route('/')
  .get( db.showPlayers, (req, res) => {
    res.render('pages/players.html.ejs', { user: req.session.user, playerList: res.rows });
  })

module.exports = players;
