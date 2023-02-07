const { client } = require("../index");
const db = require("../db");
const lobby_type = require("../lobby_type");
const game_mode = require("../game_mode");
const heroes = require("../heroes");
const rank = require("../rank");
const axios = require("axios");
const {
  inputCheck2Params,
  userSearch,
  getMatchID,
  getMatchData,
  playerInfo,
} = require("../myFunctions");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

const lastmatchCommand = async (message) => {
  let userToSearch, matchID, matchData, winner;

  let params = inputCheck2Params(message);
  let toSearch = params[0],
    match = params[1];
  if (match < 1) match = 1;
  if (!match && !toSearch) return;

  userToSearch = userSearch(toSearch);

  let reply = await message.reply("Fetching!");

  if (userToSearch) {
    matchID = await getMatchID(userToSearch, match);
    matchID = matchID[match - 1];
  } else {
    reply.edit({ content: "No user found. Please link using !link." });
  }

  if (matchID) {
    matchData = await getMatchData(matchID);
  } else {
    reply.edit({ content: "Error occured fething match data." });
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
            //Hero 1-5
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
            //Hero 6-10
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

module.exports = { lastmatchCommand };
