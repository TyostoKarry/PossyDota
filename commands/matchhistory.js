const { client } = require("../index");
const db = require("../db");
const lobby_type = require("../lobby_type");
const heroes = require("../heroes");
const rank = require("../rank");
const axios = require("axios");
const { EmbedBuilder, AttachmentBuilder, Embed } = require("discord.js");

const matchhistoryCommand = async (message) => {
  let userToSearch,
    toSearch,
    matchID = [];
  if (message.mentions.users.size) toSearch = message.mentions.users.at(0).id;
  else if (message.content.split(" ").length <= 1) toSearch = message.author.id;
  else
    return message.reply("Incorrect command parameters. !matchhistory [@user]");
  let reply = await message.reply("Fetching!");
  db.Users.forEach((user) => {
    if (user.DiscordID == toSearch) userToSearch = user;
  });
  if (userToSearch) {
    await axios
      .get(
        "https://api.opendota.com/api/players/" +
          userToSearch.SteamID +
          "/matches?limit=5"
      )
      .then((res) => {
        matchID.push(
          res.data[0],
          res.data[1],
          res.data[2],
          res.data[3],
          res.data[4]
        );
      })
      .catch((err) => {
        reply.edit({ content: "Error occured fething match ID." });
      });
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
