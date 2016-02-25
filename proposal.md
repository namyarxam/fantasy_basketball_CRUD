# Project 2 Proposal

For this project I'm going to make an interactive CRUD application called NBA Blacktop 2015-2016. This application will have full functionality > it will be allow users to create / view / edit / delete a fantasy-like team of NBA players. The data for the players will be manually uploaded by me, with 3 statistics: points per game, defensive field goal percentage, and a 'price'.

The website will have several views:
1. A login portal landing page.
2. A 'home' view.
3. A 'teams' view which will have a list of all the created teams as well as a functionality to (hopefully) allow for two teams to 'play' versus each other (See 5)
4. A 'new team' view which will allow users to pull information from the database and make a team of 5 players as long as the budget works. For the 'budget' I plan to have variable that is the starting budget, for each player selected it sends the price to the budget and subtracts it. An example of the search that will change depending on the budget it 'SELECT * FROM pg WHERE price < ($1)' and pass in that variable to $1. You will also be able to order by any of the 3 categories listed above.
5. A team battle view which will show the result of two teams from the database 'playing' each other. This page will have a built in algorithm that will calculate how much each player scored at each position based on the matchup and show the total points output for each team.
