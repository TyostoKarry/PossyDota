const { client } = require("./index");
const db = require("./db");
const lobby_type = require("./lobby_type");
const game_mode = require("./game_mode");
const heroes = require("./heroes");
const rank = require("./rank");
const axios = require("axios");

function inputCheck1Param(message) {
  let param = false;
  if (message.mentions.users.size) param = message.mentions.users.at(0).id;
  else if (message.content.split(" ").length <= 1) param = message.author.id;
  else message.reply("Incorrect command parameters. !matchhistory [@user]");
  return param;
}

function inputCheck2Params(message) {
  let param, toSearch;
  if (message.content.split(" ").length == 3 && message.mentions.users.size) {
    toSearch = message.mentions.users.at(0).id;
    if (
      message.content.split(" ")[1] ==
      "<@" + message.mentions.users.at(0).id + ">"
    )
      param = message.content.split(" ")[2];
    else param = message.content.split(" ")[1];
  } else if (
    message.content.split(" ").length == 2 &&
    message.mentions.users.size
  ) {
    toSearch = message.mentions.users.at(0).id;
    param = 1;
  } else if (message.content.split(" ").length == 2) {
    toSearch = message.author.id;
    param = message.content.split(" ")[1];
  } else if (message.content.split(" ").length == 1) {
    toSearch = message.author.id;
    param = 1;
  } else
    message.reply("Incorrect command parameters. !lastmatch [match] [@user]");
  return [toSearch, param];
}

function userSearch(toSearch) {
  let output = false;
  db.Users.forEach((user) => {
    if (user.DiscordID == toSearch) {
      output = user;
    }
  });
  return output;
}

async function getMatchID(userToSearch, matchCount) {
  let matchID = [];
  await axios
    .get(
      "https://api.opendota.com/api/players/" +
        userToSearch.SteamID +
        "/matches?limit=" +
        matchCount
    )
    .then((res) => {
      for (let match = 0; match < matchCount; match++)
        matchID.push(res.data[match]);
    })
    .catch((err) => {
      reply.edit({ content: "Error occured fething match ID." });
    });
  return matchID;
}

async function getMatchData(matchID, matchCount) {
  let matchData = await axios
    .get("https://api.opendota.com/api/matches/" + matchID.match_id)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      reply.edit({ content: "Error occured fething match data." });
    });
  return matchData;
}

function playerInfo(player, matchData) {
  value =
    heroes[matchData.players[player].hero_id].localized_name +
    " ".repeat(
      19 - heroes[matchData.players[player].hero_id].localized_name.length
    ) +
    " ".repeat(4 - String(matchData.players[player].kills).length) +
    matchData.players[player].kills +
    " ".repeat(4 - String(matchData.players[player].deaths).length) +
    matchData.players[player].deaths +
    " ".repeat(4 - String(matchData.players[player].assists).length) +
    matchData.players[player].assists +
    " ".repeat(
      5 - (matchData.players[player].net_worth / 1000).toFixed(1).length
    ) +
    (matchData.players[player].net_worth / 1000).toFixed(1) +
    "k" +
    " ".repeat(4 - String(matchData.players[player].last_hits).length) +
    matchData.players[player].last_hits +
    "/" +
    matchData.players[player].denies +
    " ".repeat(3 - String(matchData.players[player].denies).length) +
    " ".repeat(4 - String(matchData.players[player].gold_per_min).length) +
    matchData.players[player].gold_per_min +
    "/" +
    matchData.players[player].xp_per_min +
    " ".repeat(4 - String(matchData.players[player].xp_per_min).length) +
    " ".repeat(
      6 -
        String((matchData.players[player].hero_damage / 1000).toFixed(1)).length
    ) +
    (matchData.players[player].hero_damage / 1000).toFixed(1) +
    "k\n";
  return value;
}

module.exports = {
  inputCheck1Param,
  inputCheck2Params,
  userSearch,
  getMatchID,
  getMatchData,
  playerInfo,
};
