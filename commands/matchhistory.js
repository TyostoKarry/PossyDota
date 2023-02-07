const { client } = require("../index");
const db = require("../db");
const lobby_type = require("../lobby_type");
const heroes = require("../heroes");
const rank = require("../rank");
const axios = require("axios");
const { inputCheck1Param, userSearch, getMatchID } = require("../myFunctions");
const { EmbedBuilder, AttachmentBuilder, Embed } = require("discord.js");

const matchhistoryCommand = async (message) => {
  let userToSearch,
    matchID = [];

  if (inputCheck1Param(message))
    userToSearch = userSearch(inputCheck1Param(message));
  else return;

  let reply = await message.reply("Fetching!");

  if (userToSearch) {
    matchID = await getMatchID(userToSearch, 5);
  } else {
    reply.edit({ content: "No user found. Please link using !link." });
  }

  if (matchID.length == 5) {
    const attachment = new AttachmentBuilder("./assets/dota2.jpg", "dota2.jpg");
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(
        "5 most recent matches of player " + userToSearch.DiscordName + ":"
      )
      .setAuthor({
        name: "PössyDota",
        iconURL: "attachment://dota2.jpg",
      })
      .addFields(
        {
          name: " ",
          value:
            "```Hero:                K   D   A     lobby type   average rank```",
        },
        {
          //Game 1
          name: " ",
          value: gameInfo(0, matchID),
        },
        {
          //Game 1 dotabuff and game 2
          name:
            "Dotabuff link: https://www.dotabuff.com/matches/" +
            matchID[0].match_id,
          value: gameInfo(1, matchID),
        },
        {
          //Game 2 dotabuff and game 3
          name:
            "Dotabuff link: https://www.dotabuff.com/matches/" +
            matchID[1].match_id,
          value: gameInfo(2, matchID),
        },
        {
          //Game 3 dotabuff and game 4
          name:
            "Dotabuff link: https://www.dotabuff.com/matches/" +
            matchID[2].match_id,
          value: gameInfo(3, matchID),
        },
        {
          //Game 4 dotabuff and game 5
          name:
            "Dotabuff link: https://www.dotabuff.com/matches/" +
            matchID[3].match_id,
          value: gameInfo(4, matchID),
        },
        {
          //Game 5 dotabuff
          name:
            "Dotabuff link: https://www.dotabuff.com/matches/" +
            matchID[4].match_id,
          value: " ",
        }
      )
      .setTimestamp();

    reply.edit({ content: "", embeds: [exampleEmbed], files: [attachment] });
  }
};

function gameInfo(game, matchID) {
  value =
    "```" +
    heroes[matchID[game].hero_id].localized_name +
    " ".repeat(19 - heroes[matchID[game].hero_id].localized_name.length) +
    " ".repeat(3 - String(matchID[game].kills).length) +
    matchID[game].kills +
    " ".repeat(4 - String(matchID[game].deaths).length) +
    matchID[game].deaths +
    " ".repeat(4 - String(matchID[game].assists).length) +
    matchID[game].assists +
    " ".repeat(
      15 -
        lobby_type[matchID[game].lobby_type].name.split("_").slice(2).join(" ")
          .length
    ) +
    lobby_type[matchID[game].lobby_type].name.split("_").slice(2).join(" ") +
    " ".repeat(15 - String(rank[matchID[game].average_rank]?.name).length) +
    rank[matchID[game].average_rank]?.name +
    "```";
  return value;
}

module.exports = { matchhistoryCommand };
