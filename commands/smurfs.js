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
  const reply = await message.reply("Fetching!");
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
        reply.edit({ content: "Error occured fething match ID." });
      });
  } else {
    reply.edit({ content: "No user found. Please link using !link." });
  }
  if (matchID) {
    matchData = await axios
      .get("https://api.opendota.com/api/matches/" + matchID)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        reply.edit({ content: "Error occured fething match data." });
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
            reply.edit({ content: "Error occured fething win/loss data." });
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
            reply.edit({ content: "Error occured fething rank data." });
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
        {
          //Game 1
          name: "Some players public match data may be set to hidden.",
          value: " ",
        },
        // Radiant heroes 1-5
        {
          name: " ",
          value:
            "```" +
            "ansi\n[2;32mRadiant:           Games        rank   w/l%[0m\n" +
            playerInfo(0, matchData, winloss, rankTier) +
            "\n" +
            playerInfo(1, matchData, winloss, rankTier) +
            "\n" +
            playerInfo(2, matchData, winloss, rankTier) +
            "\n" +
            playerInfo(3, matchData, winloss, rankTier) +
            "\n" +
            playerInfo(4, matchData, winloss, rankTier) +
            "```",
        },
        // Dire heroes 6-10
        {
          name: " ",
          value:
            "```" +
            "ansi\n[2;31m[0m[2;31mDire:              Games        rank   w/l%[0m\n" +
            playerInfo(5, matchData, winloss, rankTier) +
            "\n" +
            playerInfo(6, matchData, winloss, rankTier) +
            "\n" +
            playerInfo(7, matchData, winloss, rankTier) +
            "\n" +
            playerInfo(8, matchData, winloss, rankTier) +
            "\n" +
            playerInfo(9, matchData, winloss, rankTier) +
            "```",
        }
      )
      .setTimestamp();

    reply.edit({ content: "", embeds: [exampleEmbed], files: [attachment] });
  }
};

function playerInfo(player, matchData, winloss, rankTier) {
  value =
    heroes[matchData.players[player].hero_id].localized_name +
    " ".repeat(
      19 - heroes[matchData.players[player].hero_id].localized_name.length
    ) +
    " ".repeat(5 - String(winloss[player].win + winloss[player].lose).length) +
    (winloss[player].win + winloss[player].lose) +
    " ".repeat(12 - String(rank[rankTier[player]].name).length) +
    rank[rankTier[player]].name +
    " ".repeat(
      6 -
        (
          (winloss[player].win / (winloss[player].win + winloss[player].lose)) *
          100
        ).toFixed(1).length
    ) +
    (
      (winloss[player].win / (winloss[player].win + winloss[player].lose)) *
      100
    ).toFixed(1) +
    "%";
  return value;
}

module.exports = { smurfsCommand };
