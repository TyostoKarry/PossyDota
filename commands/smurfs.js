const { client } = require("../index");
const db = require("../db");
const heroes = require("../heroes");
const rank = require("../rank");
const axios = require("axios");
const {
  EmbedBuilder,
  AttachmentBuilder,
  TextInputAssertions,
} = require("discord.js");

const smurfsCommand = async (message) => {
  let userToSearch,
    matchID,
    matchData,
    winloss = [],
    rankTier = [];
  db.Users.forEach((user) => {
    if (user.DiscordID == message.author.id) userToSearch = user;
  });
  if (userToSearch) {
    matchID = await axios
      .get(
        "https://api.opendota.com/api/players/" +
          userToSearch.SteamID +
          "/matches?limit=1"
      )
      .then((res) => {
        return res.data[0].match_id;
      })
      .catch((err) => {
        message.reply("Error occured fething match ID.");
      });
  }
  if (matchID) {
    matchData = await axios
      .get("https://api.opendota.com/api/matches/" + matchID)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        message.reply("Error occured fething match data.");
      });
  }
  if (matchData) {
    for (let i = 0; i < 10; i++) {
      if (matchData.players[i].account_id) {
        await axios
          .get(
            "https://api.opendota.com/api/players/" +
              matchData.players[i].account_id +
              "/wl"
          )
          .then((res) => {
            winloss.push(res.data);
          })
          .catch((err) => {
            message.reply("Error occured fething win/loss data.");
          });
        await axios
          .get(
            "https://api.opendota.com/api/players/" +
              matchData.players[i].account_id
          )
          .then((res) => {
            rankTier.push(res.data.rank_tier);
          })
          .catch((err) => {
            message.reply("Error occured fething rank data.");
          });
      } else {
        winloss.push(NaN);
        rankTier.push(00);
      }
    }
  }
  if (winloss.length == 10 && rankTier.length == 10) {
    const attachment = new AttachmentBuilder("./assets/dota2.jpg", "dota2.jpg");
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Smurfs?")
      .setAuthor({ name: "PössyDota", iconURL: "attachment://dota2.jpg" })
      .addFields(
        // Radiant heroes 1-5
        {
          name: "\u200B",
          value:
            "```" +
            "ansi\n[2;32mRadiant:           Games           rank   w/l%[0m\n" +
            heroes[matchData.players[0].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[0].hero_id].localized_name.length
            ) +
            " ".repeat(5 - String(winloss[0].win + winloss[0].lose).length) +
            (winloss[0].win + winloss[0].lose) +
            " ".repeat(15 - rank[rankTier[0]].name.length) +
            rank[rankTier[0]].name +
            " ".repeat(
              5 -
                (winloss[0].win / (winloss[0].win + winloss[0].lose)).toFixed(1)
                  .length
            ) +
            (
              (winloss[0].win / (winloss[0].win + winloss[0].lose)) *
              100
            ).toFixed(1) +
            "%\n" +
            heroes[matchData.players[1].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[1].hero_id].localized_name.length
            ) +
            " ".repeat(5 - String(winloss[1].win + winloss[1].lose).length) +
            (winloss[1].win + winloss[1].lose) +
            " ".repeat(15 - rank[rankTier[1]].name.length) +
            rank[rankTier[1]].name +
            " ".repeat(
              5 -
                (winloss[1].win / (winloss[1].win + winloss[1].lose)).toFixed(1)
                  .length
            ) +
            (
              (winloss[1].win / (winloss[1].win + winloss[1].lose)) *
              100
            ).toFixed(1) +
            "%\n" +
            heroes[matchData.players[2].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[2].hero_id].localized_name.length
            ) +
            " ".repeat(5 - String(winloss[2].win + winloss[2].lose).length) +
            (winloss[2].win + winloss[2].lose) +
            " ".repeat(15 - rank[rankTier[2]].name.length) +
            rank[rankTier[2]].name +
            " ".repeat(
              5 -
                (winloss[2].win / (winloss[2].win + winloss[2].lose)).toFixed(1)
                  .length
            ) +
            (
              (winloss[2].win / (winloss[2].win + winloss[2].lose)) *
              100
            ).toFixed(1) +
            "%\n" +
            heroes[matchData.players[3].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[3].hero_id].localized_name.length
            ) +
            " ".repeat(5 - String(winloss[3].win + winloss[3].lose).length) +
            (winloss[3].win + winloss[3].lose) +
            " ".repeat(15 - rank[rankTier[3]].name.length) +
            rank[rankTier[3]].name +
            " ".repeat(
              5 -
                (winloss[3].win / (winloss[3].win + winloss[3].lose)).toFixed(1)
                  .length
            ) +
            (
              (winloss[3].win / (winloss[3].win + winloss[3].lose)) *
              100
            ).toFixed(1) +
            "%\n" +
            heroes[matchData.players[4].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[4].hero_id].localized_name.length
            ) +
            " ".repeat(5 - String(winloss[4].win + winloss[4].lose).length) +
            (winloss[4].win + winloss[4].lose) +
            " ".repeat(15 - rank[rankTier[4]].name.length) +
            rank[rankTier[4]].name +
            " ".repeat(
              5 -
                (winloss[4].win / (winloss[4].win + winloss[4].lose)).toFixed(1)
                  .length
            ) +
            (
              (winloss[4].win / (winloss[4].win + winloss[4].lose)) *
              100
            ).toFixed(1) +
            "%" +
            "```",
        },
        // Dire heroes 6-7
        {
          name: "\u200B",
          value:
            "```" +
            "ansi\n[2;31m[0m[2;31mDire:              Games           rank   w/l%[0m\n" +
            heroes[matchData.players[5].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[5].hero_id].localized_name.length
            ) +
            " ".repeat(5 - String(winloss[5].win + winloss[5].lose).length) +
            (winloss[5].win + winloss[5].lose) +
            " ".repeat(15 - rank[rankTier[5]].name.length) +
            rank[rankTier[5]].name +
            " ".repeat(
              5 -
                (winloss[5].win / (winloss[5].win + winloss[5].lose)).toFixed(1)
                  .length
            ) +
            (
              (winloss[5].win / (winloss[5].win + winloss[5].lose)) *
              100
            ).toFixed(1) +
            "%\n" +
            heroes[matchData.players[6].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[6].hero_id].localized_name.length
            ) +
            " ".repeat(5 - String(winloss[6].win + winloss[6].lose).length) +
            (winloss[6].win + winloss[6].lose) +
            " ".repeat(15 - rank[rankTier[6]].name.length) +
            rank[rankTier[6]].name +
            " ".repeat(
              5 -
                (winloss[6].win / (winloss[6].win + winloss[6].lose)).toFixed(1)
                  .length
            ) +
            (
              (winloss[6].win / (winloss[6].win + winloss[6].lose)) *
              100
            ).toFixed(1) +
            "%\n" +
            heroes[matchData.players[7].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[7].hero_id].localized_name.length
            ) +
            " ".repeat(5 - String(winloss[7].win + winloss[7].lose).length) +
            (winloss[7].win + winloss[7].lose) +
            " ".repeat(15 - rank[rankTier[7]].name.length) +
            rank[rankTier[7]].name +
            " ".repeat(
              5 -
                (winloss[7].win / (winloss[7].win + winloss[7].lose)).toFixed(1)
                  .length
            ) +
            (
              (winloss[7].win / (winloss[7].win + winloss[7].lose)) *
              100
            ).toFixed(1) +
            "%\n" +
            heroes[matchData.players[8].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[8].hero_id].localized_name.length
            ) +
            " ".repeat(5 - String(winloss[8].win + winloss[8].lose).length) +
            (winloss[8].win + winloss[8].lose) +
            " ".repeat(15 - rank[rankTier[8]].name.length) +
            rank[rankTier[8]].name +
            " ".repeat(
              5 -
                (winloss[8].win / (winloss[8].win + winloss[8].lose)).toFixed(1)
                  .length
            ) +
            (
              (winloss[8].win / (winloss[8].win + winloss[8].lose)) *
              100
            ).toFixed(1) +
            "%\n" +
            heroes[matchData.players[9].hero_id].localized_name +
            " ".repeat(
              19 - heroes[matchData.players[9].hero_id].localized_name.length
            ) +
            " ".repeat(5 - String(winloss[9].win + winloss[9].lose).length) +
            (winloss[9].win + winloss[9].lose) +
            " ".repeat(15 - rank[rankTier[9]].name.length) +
            rank[rankTier[9]].name +
            " ".repeat(
              5 -
                (winloss[9].win / (winloss[9].win + winloss[9].lose)).toFixed(1)
                  .length
            ) +
            (
              (winloss[9].win / (winloss[9].win + winloss[9].lose)) *
              100
            ).toFixed(1) +
            "%" +
            "```",
        }
      )
      .setTimestamp();

    message.reply({ embeds: [exampleEmbed], files: [attachment] });
  }
};

async function getWinLossAndRank() {}

module.exports = { smurfsCommand };
