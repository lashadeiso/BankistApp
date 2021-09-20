"use strict";
const game = {
  team1: "Bayern Munich",
  team2: "Borrusia Dortmund",
  players: [
    [
      "Neuer",
      "Pavard",
      "Martinez",
      "Alaba",
      "Davies",
      "Kimmich",
      "Goretzka",
      "Coman",
      "Muller",
      "Gnarby",
      "Lewandowski",
    ],
    [
      "Burki",
      "Schulz",
      "Hummels",
      "Akanji",
      "Hakimi",
      "Weigl",
      "Witsel",
      "Hazard",
      "Brandt",
      "Sancho",
      "Gotze",
    ],
  ],
  score: "4:0",
  scored: ["Lewandowski", "Gnarby", "Lewandowski", "Hummels"],
  date: "Nov 9th,2037",
  odds: {
    team1: 1.33,
    x: 3.25,
    team2: 6.5,
  },
};

//Coding Challenge #1
//1
const [player1, player2] = game.players;
//console.log(player1, player2);

//2
const [gk, ...fieldPlayers] = player1;
//console.log(gk,fieldPlayers);

//3
const allPlayers = [...player1, ...player2];
//console.log(allPlayers);

//4
const players1Final = [...player1, "Thiago", "Coutinho", "Perisic"];
//console.log(players1Final);

//5
const { team1, x: draw, team2 } = game.odds;
//console.log(team1, draw, team2);

//6 ????

//7
//team1 < team2 && console.log("team1 more likely to win");

//Coding Challenge #2
//1
for (let [index, item] of Object.entries(game.scored)) {
  //  console.log(`"Goal ${Number(index) + 1}: ${item}"`);
}

//2
const odds = Object.values(game.odds);
let sum = 0;
for (let item of odds) {
  sum += item;
}
//console.log(sum / odds.length);

//3 ???
const oddsPrint = Object.entries(game.odds);
const [key, item] = oddsPrint[0];

//4 ??
const scored = game.scored;
console.log(scored);
