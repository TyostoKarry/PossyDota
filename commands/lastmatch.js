const { client } = require("../index");
const db = require("../db");
const lobby_type = require("../lobby_type");
const game_mode = require("../game_mode");
const heroes = require("../heroes");
const rank = require("../rank");
const axios = require("axios");
const {
  inputCheck,
  userSearch,
  getMatchID,
  getMatchData,
  basicMatchInfoBuilder,
} = require("../myFunctions");
const { AttachmentBuilder } = require("discord.js");

const lastmatchCommand = async (message) => {
  let matchID, matchData;

  let params = inputCheck(message);
  if (!params) return;
  let toSearch = params[0],
    match = params[1];
  if (match < 1) match = 1;
  else if (match > 100000) matchCount = 100000;

  let userToSearch = userSearch(toSearch);

  let reply = await message.reply("Fetching!");

  if (userToSearch) {
    matchID = await getMatchID(userToSearch, match, reply, "");
    matchID = matchID[match - 1];
  } else {
    return reply.edit({ content: "No user found. Please link using !link." });
  }

  if (matchID) {
    matchData = await getMatchData(matchID, reply);
  } else {
    return reply.edit({ content: "Error occured fething match data." });
  }

  if (matchData) {
    const matchInfoEmbed = basicMatchInfoBuilder(matchData, matchID);
    const matchInfoAttachment = new AttachmentBuilder(
      "./assets/dota2.jpg",
      "dota2.jpg"
    );

    reply.edit({
      content: "",
      embeds: [matchInfoEmbed],
      files: [matchInfoAttachment],
    });
  }
};

module.exports = { lastmatchCommand };
