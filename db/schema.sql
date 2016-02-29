CREATE TABLE users (
  userid SERIAL PRIMARY KEY UNIQUE,
  email VARCHAR(255) NOT NULL,
  password_digest VARCHAR(255) NOT NULL
);

CREATE TABLE players (
  playerid SERIAL PRIMARY KEY UNIQUE,
  position VARCHAR(2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  img_url VARCHAR(255) NOT NULL,
  ppg NUMERIC NOT NULL,
  dfg NUMERIC NOT NULL,
  price INT NOT NULL
);

CREATE TABLE teams (
  teamid SERIAL PRIMARY KEY UNIQUE,
  playerid INT REFERENCES players(playerid)
);



CREATE TABLE users_teams (
  userid INT REFERENCES users(userid),
  teamid INT REFERENCES teams(teamid)
);

CREATE TABLE teams_players (
  teamid INT REFERENCES teams(teamid),
  playerid INT REFERENCES players(playerid)
);


select players.name, players.position, players.ppg, players.dfg, players.img_url, teams.teamid from players inner join teams_players on players.playerid = teams_players.playerid inner join teams on teams_players.teamid = teams.teamid;
