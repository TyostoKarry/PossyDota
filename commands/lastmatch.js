const { client } = require("../index");
const db = require("../db");
const lobby_type = require("../lobby_type");
const game_mode = require("../game_mode");
const heroes = require("../heroes");
const rank = require("../rank");
const axios = require("axios");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

const lastmatchCommand = async (message) => {
  let userToSearch, toSearch, match, matchID, matchData, winner;
  // Check for the command parameters
  if (message.content.split(" ").length == 3 && message.mentions.users.size) {
    toSearch = message.mentions.users.at(0).id;
    if (
      message.content.split(" ")[1] ==
      "<@" + message.mentions.users.at(0).id + ">"
    )
      match = message.content.split(" ")[2];
    else match = message.content.split(" ")[1];
  } else if (message.content.split(" ").length == 2) {
    if (message.mentions.users.size) {
      toSearch = message.mentions.users.at(0).id;
      match = 1;
    } else {
      match = message.content.split(" ")[1];
      toSearch = message.author.id;
    }
  } else if (message.content.split(" ").length <= 1) {
    toSearch = message.author.id;
    match = 1;
  } else
    return message.reply(
      "Incorrect command parameters. !lastmatch [match] [@user]"
    );
  let reply = await message.reply("Fetching!");
  db.Users.forEach((user) => {
    if (user.DiscordID == toSearch) userToSearch = user;
  });
  if (userToSearch) {
    matchID = await axios
      .get(
        "https://api.opendota.com/api/players/" +
          userToSearch.SteamID +
          "/matches?limit=" +
          match
      )
      .then((res) => {
        return res.data[match - 1];
      })
      .catch((err) => {
        reply.edit({ content: "Error occured fething match ID." });
      });
  } else {
    reply.edit({ content: "No user found. Please link using !link." });
  }
  if (matchID) {
    matchData = await axios
      .get("https://api.opendota.com/api/matches/" + matchID.match_id)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        reply.edit({ content: "Error occured fething match data." });
      });
  }
  if (matchData) {
    if (matchData.radiant_win) winner = "Radiant";
    else winner = "Dire";
    const attachment = new AttachmentBuilder("./assets/dota2.jpg", "dota2.jpg");
    const exampleEmbed = new EmbedBuilder()
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
            lobby_type[matchData.lobby_type].name
              .split("_")
              .slice(2)
              .join(" ") +
            "    Game mode: " +
            game_mode[matchData.game_mode].name.split("_").slice(2).join(" ") +
            "    Average rank: " +
            rank[matchID.average_rank]?.name,
          value:
            "```" +
            "ansi\n[2;32mRadiant:              K   D   A   NET  LH/DN  GPM/XPM     DMG[0m\n" +
            //Hero 1
            playerInfo(0, matchData) +
            playerInfo(1, matchData) +
            playerInfo(2, matchData) +
            playerInfo(3, matchData) +
            playerInfo(4, matchData) +
            "```",
        },
        //Dire
        {
          name: " ",
          value:
            "```" +
            "ansi\n[2;31m[0m[2;31mDire:                 K   D   A   NET  LH/DN  GPM/XPM     DMG[0m\n" +
            //Hero 6
            playerInfo(5, matchData) +
            playerInfo(6, matchData) +
            playerInfo(7, matchData) +
            playerInfo(8, matchData) +
            playerInfo(9, matchData) +
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

    reply.edit({ content: "", embeds: [exampleEmbed], files: [attachment] });
  }
};

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

module.exports = { lastmatchCommand };
