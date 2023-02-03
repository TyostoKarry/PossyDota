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
        winloss.push(null);
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
        {
          name: "\u200B",
          value: "```ansi\n[2;32mRadiant:           Games           rank   w/l%[0m```",
        },
        // Hero 1
        {
          name: "\u200B",
          value:
            "```" +
            heroes[matchData.players[0].hero_id].localized_name +
            " ".repeat(
              20 - heroes[matchData.players[0].hero_id].localized_name.length
            ) +
            " ".repeat(5 - (winloss[0].win + winloss[0].lose).length) +
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
