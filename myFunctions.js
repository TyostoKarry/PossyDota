const { client } = require("./index");
const db = require("./db");
const lobby_type = require("./lobby_type");
const game_mode = require("./game_mode");
const heroes = require("./heroes");
const rank = require("./rank");
const axios = require("axios");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

//Checks message parameters for mentions and additional parameter
//Returns toSearch and param in an array
//toSearch includes mentions user.id and param can be anything.
function inputCheck(message) {
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
  } else {
    message.reply("Incorrect command parameters.");
    return false;
  }
  return [toSearch, param];
}

//Searches database for mach for a searchable user
//Return: database use if found and false otherwise
function userSearch(toSearch) {
  let output = false;
  db.Users.forEach((user) => {
    if (user.DiscordID == toSearch) {
      output = user;
    }
  });
  return output;
}

//Fetches opendota api for a [matchCount] most recent match of [userToSearch]
//Returns matchID object
async function getMatchID(userToSearch, matchCount, reply, queryParam) {
  let matchID = [];
  await axios
    .get(
      "https://api.opendota.com/api/players/" +
        userToSearch.SteamID +
        "/matches?limit=" +
        matchCount +
        queryParam
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

//Fetches opendota api for a [matchID] match
//Returns matchData object
async function getMatchData(matchID, reply) {
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

//Creates embed that includes basic match info and player stats
//Returns embed
function basicMatchInfoBuilder(matchData, matchID) {
  let winner;
  if (matchData.radiant_win) winner = "Radiant";
  else winner = "Dire";
  const attachment = new AttachmentBuilder("./assets/dota2.jpg", "dota2.jpg");
  const matchInfo = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("MatchID: " + matchData.match_id)
    .setAuthor({ name: "PössyDota", iconURL: "attachment://dota2.jpg" })
    .addFields(
      //Radiant
      {
        name:
          "Winner: " +
          winner +
          "    Kills " +
          matchData.radiant_score +
          ":" +
          matchData.dire_score +
          "    Duration: " +
          Math.floor(matchData.duration / 60) +
          ":" +
          (matchData.duration -
            Math.floor(matchData.duration / 60) * 60 +
            "\n") +
          "Lobby type: " +
          lobby_type[matchData.lobby_type].name.split("_").slice(2).join(" ") +
          "    Game mode: " +
          game_mode[matchData.game_mode].name.split("_").slice(2).join(" ") +
          "    Average rank: " +
          rank[matchID.average_rank]?.name,
        value:
          "```" +
          "ansi\n[2;32mRadiant:              K   D   A   NET  LH/DN  GPM/XPM     DMG[0m\n" +
          //Hero 1-5
          playerInfo(matchData, 0) +
          playerInfo(matchData, 1) +
          playerInfo(matchData, 2) +
          playerInfo(matchData, 3) +
          playerInfo(matchData, 4) +
          "```",
      },
      //Dire
      {
        name: " ",
        value:
          "```" +
          "ansi\n[2;31m[0m[2;31mDire:                 K   D   A   NET  LH/DN  GPM/XPM     DMG[0m\n" +
          //Hero 6-10
          playerInfo(matchData, 5) +
          playerInfo(matchData, 6) +
          playerInfo(matchData, 7) +
          playerInfo(matchData, 8) +
          playerInfo(matchData, 9) +
          "```",
      },
      {
        name:
          "Dotabuff link: https://www.dotabuff.com/matches/" +
          matchData.match_id,
        value: " ",
      }
    )
    .setTimestamp();

  return matchInfo;
}

//Prints out player info in the following order
//(name\n, hero, kills, deaths, assists, networth, lastHit/deny, goldPerMin/xpPerMin, damage)
function playerInfo(matchData, player) {
  value =
    matchData.players[player].personaname +
    ":\n" +
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
  inputCheck,
  userSearch,
  getMatchID,
  getMatchData,
  playerInfo,
  basicMatchInfoBuilder,
};
