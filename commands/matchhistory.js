const { client } = require("../index");
const db = require("../db");
const lobby_type = require("../lobby_type");
const heroes = require("../heroes");
const rank = require("../rank");
const axios = require("axios");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

const matchhistoryCommand = async (message) => {
  let userToSearch,
    matchID = [];
  db.Users.forEach((user) => {
    if (user.DiscordID == message.author.id) userToSearch = user;
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
        message.reply("Error occured fething match ID.");
      });
  } else {
    message.reply("No user found. Please link using !link.");
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
          value:
            "```" +
            heroes[matchID[0].hero_id].localized_name +
            " ".repeat(19 - heroes[matchID[0].hero_id].localized_name.length) +
            " ".repeat(3 - String(matchID[0].kills).length) +
            matchID[0].kills +
            " ".repeat(4 - String(matchID[0].deaths).length) +
            matchID[0].deaths +
            " ".repeat(4 - String(matchID[0].assists).length) +
            matchID[0].assists +
            " ".repeat(
              15 -
                lobby_type[matchID[0].lobby_type].name
                  .split("_")
                  .slice(2)
                  .join(" ").length
            ) +
            lobby_type[matchID[0].lobby_type].name
              .split("_")
              .slice(2)
              .join(" ") +
            " ".repeat(15 - rank[matchID[0].average_rank].name.length) +
            rank[matchID[0].average_rank].name +
            "```",
        },
        {
          //Game 1 dotabuff and game 2
          name:
            "Dotabuff link: https://www.dotabuff.com/matches/" +
            matchID[0].match_id,
          value:
            "```" +
            heroes[matchID[1].hero_id].localized_name +
            " ".repeat(19 - heroes[matchID[1].hero_id].localized_name.length) +
            " ".repeat(3 - String(matchID[1].kills).length) +
            matchID[1].kills +
            " ".repeat(4 - String(matchID[1].deaths).length) +
            matchID[1].deaths +
            " ".repeat(4 - String(matchID[1].assists).length) +
            matchID[1].assists +
            " ".repeat(
              15 -
                lobby_type[matchID[1].lobby_type].name
                  .split("_")
                  .slice(2)
                  .join(" ").length
            ) +
            lobby_type[matchID[1].lobby_type].name
              .split("_")
              .slice(2)
              .join(" ") +
            " ".repeat(15 - rank[matchID[1].average_rank].name.length) +
            rank[matchID[1].average_rank].name +
            "```",
        },
        {
          //Game 2 dotabuff and game 3
          name:
            "Dotabuff link: https://www.dotabuff.com/matches/" +
            matchID[1].match_id,
          value:
            "```" +
            heroes[matchID[2].hero_id].localized_name +
            " ".repeat(19 - heroes[matchID[2].hero_id].localized_name.length) +
            " ".repeat(3 - String(matchID[2].kills).length) +
            matchID[2].kills +
            " ".repeat(4 - String(matchID[2].deaths).length) +
            matchID[2].deaths +
            " ".repeat(4 - String(matchID[2].assists).length) +
            matchID[2].assists +
            " ".repeat(
              15 -
                lobby_type[matchID[2].lobby_type].name
                  .split("_")
                  .slice(2)
                  .join(" ").length
            ) +
            lobby_type[matchID[2].lobby_type].name
              .split("_")
              .slice(2)
              .join(" ") +
            " ".repeat(15 - rank[matchID[2].average_rank].name.length) +
            rank[matchID[2].average_rank].name +
            "```",
        },
        {
          //Game 3 dotabuff and game 4
          name:
            "Dotabuff link: https://www.dotabuff.com/matches/" +
            matchID[2].match_id,
          value:
            "```" +
            heroes[matchID[3].hero_id].localized_name +
            " ".repeat(19 - heroes[matchID[3].hero_id].localized_name.length) +
            " ".repeat(3 - String(matchID[3].kills).length) +
            matchID[3].kills +
            " ".repeat(4 - String(matchID[3].deaths).length) +
            matchID[3].deaths +
            " ".repeat(4 - String(matchID[3].assists).length) +
            matchID[3].assists +
            " ".repeat(
              15 -
                lobby_type[matchID[3].lobby_type].name
                  .split("_")
                  .slice(2)
                  .join(" ").length
            ) +
            lobby_type[matchID[3].lobby_type].name
              .split("_")
              .slice(2)
              .join(" ") +
            " ".repeat(15 - rank[matchID[3].average_rank].name.length) +
            rank[matchID[3].average_rank].name +
            "```",
        },
        {
          //Game 4 dotabuff and game 5
          name:
            "Dotabuff link: https://www.dotabuff.com/matches/" +
            matchID[3].match_id,
          value:
            "```" +
            heroes[matchID[4].hero_id].localized_name +
            " ".repeat(19 - heroes[matchID[4].hero_id].localized_name.length) +
            " ".repeat(3 - String(matchID[4].kills).length) +
            matchID[4].kills +
            " ".repeat(4 - String(matchID[4].deaths).length) +
            matchID[4].deaths +
            " ".repeat(4 - String(matchID[4].assists).length) +
            matchID[4].assists +
            " ".repeat(
              15 -
                lobby_type[matchID[4].lobby_type].name
                  .split("_")
                  .slice(2)
                  .join(" ").length
            ) +
            lobby_type[matchID[4].lobby_type].name
              .split("_")
              .slice(2)
              .join(" ") +
            " ".repeat(15 - rank[matchID[4].average_rank].name.length) +
            rank[matchID[4].average_rank].name +
            "```",
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

    message.reply({ embeds: [exampleEmbed], files: [attachment] });
  }
};

module.exports = { matchhistoryCommand };
