const { client } = require("../index");
const db = require("../db");
const lobby_type = require("../lobby_type");
const game_mode = require("../game_mode");
const heroes = require("../heroes");
const rank = require("../rank");
const axios = require("axios");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

const lastmatchCommand = async (message) => {
  let userToSearch,
    match,
    matchID,
    matchData,
    winner,
    parameter1 = message.content.split(" ")[1];
  if (parameter1 < 1) match = 1;
  else if (parameter1) match = parameter1;
  else match = 1;
  db.Users.forEach((user) => {
    if (user.DiscordID == message.author.id) userToSearch = user;
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
        message.reply("Error occured fething match ID.");
      });
  } else {
    message.reply("No user found. Please link using !link.");
  }
  if (matchID) {
    matchData = await axios
      .get("https://api.opendota.com/api/matches/" + matchID.match_id)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        message.reply("Error occured fething match data.");
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
            rank[matchID.average_rank].name,
          value:
            "```" +
            "ansi\n[2;32mRadiant:           K   D   A   NET     LH/DN  GPM/XPM     DMG[0m\n" +
            //Hero 1
            heroes[matchData.players[0].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[0].hero_id].localized_name.length
            ) +
            matchData.players[0].kills +
            " ".repeat(4 - String(matchData.players[0].kills).length) +
            matchData.players[0].deaths +
            " ".repeat(4 - String(matchData.players[0].deaths).length) +
            matchData.players[0].assists +
            " ".repeat(4 - String(matchData.players[0].assists).length) +
            (matchData.players[0].net_worth / 1000).toFixed(1) +
            "k" +
            " ".repeat(
              5 - (matchData.players[0].net_worth / 1000).toFixed(1).length
            ) +
            " ".repeat(4 - String(matchData.players[0].last_hits).length) +
            matchData.players[0].last_hits +
            "/" +
            matchData.players[0].denies +
            " ".repeat(3 - String(matchData.players[0].denies).length) +
            " ".repeat(4 - String(matchData.players[0].gold_per_min).length) +
            matchData.players[0].gold_per_min +
            "/" +
            matchData.players[0].xp_per_min +
            " ".repeat(4 - String(matchData.players[0].xp_per_min).length) +
            " ".repeat(
              6 -
                String((matchData.players[0].hero_damage / 1000).toFixed(1))
                  .length
            ) +
            (matchData.players[0].hero_damage / 1000).toFixed(1) +
            "k\n" +
            //Hero 2
            heroes[matchData.players[1].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[1].hero_id].localized_name.length
            ) +
            matchData.players[1].kills +
            " ".repeat(4 - String(matchData.players[1].kills).length) +
            matchData.players[1].deaths +
            " ".repeat(4 - String(matchData.players[1].deaths).length) +
            matchData.players[1].assists +
            " ".repeat(4 - String(matchData.players[1].assists).length) +
            (matchData.players[1].net_worth / 1000).toFixed(1) +
            "k" +
            " ".repeat(
              5 - (matchData.players[1].net_worth / 1000).toFixed(1).length
            ) +
            " ".repeat(4 - String(matchData.players[1].last_hits).length) +
            matchData.players[1].last_hits +
            "/" +
            matchData.players[1].denies +
            " ".repeat(3 - String(matchData.players[1].denies).length) +
            " ".repeat(4 - String(matchData.players[1].gold_per_min).length) +
            matchData.players[1].gold_per_min +
            "/" +
            matchData.players[1].xp_per_min +
            " ".repeat(4 - String(matchData.players[1].xp_per_min).length) +
            " ".repeat(
              6 -
                String((matchData.players[1].hero_damage / 1000).toFixed(1))
                  .length
            ) +
            (matchData.players[1].hero_damage / 1000).toFixed(1) +
            "k\n" +
            //Hero 3
            heroes[matchData.players[2].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[2].hero_id].localized_name.length
            ) +
            matchData.players[2].kills +
            " ".repeat(4 - String(matchData.players[2].kills).length) +
            matchData.players[2].deaths +
            " ".repeat(4 - String(matchData.players[2].deaths).length) +
            matchData.players[2].assists +
            " ".repeat(4 - String(matchData.players[2].assists).length) +
            (matchData.players[2].net_worth / 1000).toFixed(1) +
            "k" +
            " ".repeat(
              5 - (matchData.players[2].net_worth / 1000).toFixed(1).length
            ) +
            " ".repeat(4 - String(matchData.players[2].last_hits).length) +
            matchData.players[2].last_hits +
            "/" +
            matchData.players[2].denies +
            " ".repeat(3 - String(matchData.players[2].denies).length) +
            " ".repeat(4 - String(matchData.players[2].gold_per_min).length) +
            matchData.players[2].gold_per_min +
            "/" +
            matchData.players[2].xp_per_min +
            " ".repeat(4 - String(matchData.players[2].xp_per_min).length) +
            " ".repeat(
              6 -
                String((matchData.players[2].hero_damage / 1000).toFixed(1))
                  .length
            ) +
            (matchData.players[2].hero_damage / 1000).toFixed(1) +
            "k\n" +
            //Hero 4
            heroes[matchData.players[3].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[3].hero_id].localized_name.length
            ) +
            matchData.players[3].kills +
            " ".repeat(4 - String(matchData.players[3].kills).length) +
            matchData.players[3].deaths +
            " ".repeat(4 - String(matchData.players[3].deaths).length) +
            matchData.players[3].assists +
            " ".repeat(4 - String(matchData.players[3].assists).length) +
            (matchData.players[3].net_worth / 1000).toFixed(1) +
            "k" +
            " ".repeat(
              5 - (matchData.players[3].net_worth / 1000).toFixed(1).length
            ) +
            " ".repeat(4 - String(matchData.players[3].last_hits).length) +
            matchData.players[3].last_hits +
            "/" +
            matchData.players[3].denies +
            " ".repeat(3 - String(matchData.players[3].denies).length) +
            " ".repeat(4 - String(matchData.players[3].gold_per_min).length) +
            matchData.players[3].gold_per_min +
            "/" +
            matchData.players[3].xp_per_min +
            " ".repeat(4 - String(matchData.players[3].xp_per_min).length) +
            " ".repeat(
              6 -
                String((matchData.players[3].hero_damage / 1000).toFixed(1))
                  .length
            ) +
            (matchData.players[3].hero_damage / 1000).toFixed(1) +
            "k\n" +
            //Hero 5
            heroes[matchData.players[4].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[4].hero_id].localized_name.length
            ) +
            matchData.players[4].kills +
            " ".repeat(4 - String(matchData.players[4].kills).length) +
            matchData.players[4].deaths +
            " ".repeat(4 - String(matchData.players[4].deaths).length) +
            matchData.players[4].assists +
            " ".repeat(4 - String(matchData.players[4].assists).length) +
            (matchData.players[4].net_worth / 1000).toFixed(1) +
            "k" +
            " ".repeat(
              5 - (matchData.players[4].net_worth / 1000).toFixed(1).length
            ) +
            " ".repeat(4 - String(matchData.players[4].last_hits).length) +
            matchData.players[4].last_hits +
            "/" +
            matchData.players[4].denies +
            " ".repeat(3 - String(matchData.players[4].denies).length) +
            " ".repeat(4 - String(matchData.players[4].gold_per_min).length) +
            matchData.players[4].gold_per_min +
            "/" +
            matchData.players[4].xp_per_min +
            " ".repeat(4 - String(matchData.players[4].xp_per_min).length) +
            " ".repeat(
              6 -
                String((matchData.players[4].hero_damage / 1000).toFixed(1))
                  .length
            ) +
            (matchData.players[4].hero_damage / 1000).toFixed(1) +
            "k" +
            "```",
        },
        //Dire
        {
          name: " ",
          value:
            "```" +
            "ansi\n[2;31m[0m[2;31mDire:              K   D   A   NET     LH/DN  GPM/XPM     DMG[0m\n" +
            //Hero 6
            heroes[matchData.players[5].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[5].hero_id].localized_name.length
            ) +
            matchData.players[5].kills +
            " ".repeat(4 - String(matchData.players[5].kills).length) +
            matchData.players[5].deaths +
            " ".repeat(4 - String(matchData.players[5].deaths).length) +
            matchData.players[5].assists +
            " ".repeat(4 - String(matchData.players[5].assists).length) +
            (matchData.players[5].net_worth / 1000).toFixed(1) +
            "k" +
            " ".repeat(
              5 - (matchData.players[5].net_worth / 1000).toFixed(1).length
            ) +
            " ".repeat(4 - String(matchData.players[5].last_hits).length) +
            matchData.players[5].last_hits +
            "/" +
            matchData.players[5].denies +
            " ".repeat(3 - String(matchData.players[5].denies).length) +
            " ".repeat(4 - String(matchData.players[5].gold_per_min).length) +
            matchData.players[5].gold_per_min +
            "/" +
            matchData.players[5].xp_per_min +
            " ".repeat(4 - String(matchData.players[5].xp_per_min).length) +
            " ".repeat(
              6 -
                String((matchData.players[5].hero_damage / 1000).toFixed(1))
                  .length
            ) +
            (matchData.players[5].hero_damage / 1000).toFixed(1) +
            "k\n" +
            //Hero 7
            heroes[matchData.players[6].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[6].hero_id].localized_name.length
            ) +
            matchData.players[6].kills +
            " ".repeat(4 - String(matchData.players[6].kills).length) +
            matchData.players[6].deaths +
            " ".repeat(4 - String(matchData.players[6].deaths).length) +
            matchData.players[6].assists +
            " ".repeat(4 - String(matchData.players[6].assists).length) +
            (matchData.players[6].net_worth / 1000).toFixed(1) +
            "k" +
            " ".repeat(
              5 - (matchData.players[6].net_worth / 1000).toFixed(1).length
            ) +
            " ".repeat(4 - String(matchData.players[6].last_hits).length) +
            matchData.players[6].last_hits +
            "/" +
            matchData.players[6].denies +
            " ".repeat(3 - String(matchData.players[6].denies).length) +
            " ".repeat(4 - String(matchData.players[6].gold_per_min).length) +
            matchData.players[6].gold_per_min +
            "/" +
            matchData.players[6].xp_per_min +
            " ".repeat(4 - String(matchData.players[6].xp_per_min).length) +
            " ".repeat(
              6 -
                String((matchData.players[6].hero_damage / 1000).toFixed(1))
                  .length
            ) +
            (matchData.players[6].hero_damage / 1000).toFixed(1) +
            "k\n" +
            //Hero 8
            heroes[matchData.players[7].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[7].hero_id].localized_name.length
            ) +
            matchData.players[7].kills +
            " ".repeat(4 - String(matchData.players[7].kills).length) +
            matchData.players[7].deaths +
            " ".repeat(4 - String(matchData.players[7].deaths).length) +
            matchData.players[7].assists +
            " ".repeat(4 - String(matchData.players[7].assists).length) +
            (matchData.players[7].net_worth / 1000).toFixed(1) +
            "k" +
            " ".repeat(
              5 - (matchData.players[7].net_worth / 1000).toFixed(1).length
            ) +
            " ".repeat(4 - String(matchData.players[7].last_hits).length) +
            matchData.players[7].last_hits +
            "/" +
            matchData.players[7].denies +
            " ".repeat(3 - String(matchData.players[7].denies).length) +
            " ".repeat(4 - String(matchData.players[7].gold_per_min).length) +
            matchData.players[7].gold_per_min +
            "/" +
            matchData.players[7].xp_per_min +
            " ".repeat(4 - String(matchData.players[7].xp_per_min).length) +
            " ".repeat(
              6 -
                String((matchData.players[7].hero_damage / 1000).toFixed(1))
                  .length
            ) +
            (matchData.players[7].hero_damage / 1000).toFixed(1) +
            "k\n" +
            //Hero 9
            heroes[matchData.players[8].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[8].hero_id].localized_name.length
            ) +
            matchData.players[8].kills +
            " ".repeat(4 - String(matchData.players[8].kills).length) +
            matchData.players[8].deaths +
            " ".repeat(4 - String(matchData.players[8].deaths).length) +
            matchData.players[8].assists +
            " ".repeat(4 - String(matchData.players[8].assists).length) +
            (matchData.players[8].net_worth / 1000).toFixed(1) +
            "k" +
            " ".repeat(
              5 - (matchData.players[8].net_worth / 1000).toFixed(1).length
            ) +
            " ".repeat(4 - String(matchData.players[8].last_hits).length) +
            matchData.players[8].last_hits +
            "/" +
            matchData.players[8].denies +
            " ".repeat(3 - String(matchData.players[8].denies).length) +
            " ".repeat(4 - String(matchData.players[8].gold_per_min).length) +
            matchData.players[8].gold_per_min +
            "/" +
            matchData.players[8].xp_per_min +
            " ".repeat(4 - String(matchData.players[8].xp_per_min).length) +
            " ".repeat(
              6 -
                String((matchData.players[8].hero_damage / 1000).toFixed(1))
                  .length
            ) +
            (matchData.players[8].hero_damage / 1000).toFixed(1) +
            "k\n" +
            //Hero 10
            heroes[matchData.players[9].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[9].hero_id].localized_name.length
            ) +
            matchData.players[9].kills +
            " ".repeat(4 - String(matchData.players[9].kills).length) +
            matchData.players[9].deaths +
            " ".repeat(4 - String(matchData.players[9].deaths).length) +
            matchData.players[9].assists +
            " ".repeat(4 - String(matchData.players[9].assists).length) +
            (matchData.players[9].net_worth / 1000).toFixed(1) +
            "k" +
            " ".repeat(
              5 - (matchData.players[9].net_worth / 1000).toFixed(1).length
            ) +
            " ".repeat(4 - String(matchData.players[9].last_hits).length) +
            matchData.players[9].last_hits +
            "/" +
            matchData.players[9].denies +
            " ".repeat(3 - String(matchData.players[9].denies).length) +
            " ".repeat(4 - String(matchData.players[9].gold_per_min).length) +
            matchData.players[9].gold_per_min +
            "/" +
            matchData.players[9].xp_per_min +
            " ".repeat(4 - String(matchData.players[9].xp_per_min).length) +
            " ".repeat(
              6 -
                String((matchData.players[9].hero_damage / 1000).toFixed(1))
                  .length
            ) +
            (matchData.players[9].hero_damage / 1000).toFixed(1) +
            "k" +
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

    message.reply({ embeds: [exampleEmbed], files: [attachment] });
  }
};

module.exports = { lastmatchCommand };
