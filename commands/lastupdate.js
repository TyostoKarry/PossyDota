const { Message } = require("discord.js");
const { client } = require("../index");
const db = require("../db");
const axios = require("axios");
const Parser = require("rss-parser");

async function getLastUpdate(message) {
  if (db.Data.newsChannelId == null) {
    message.reply("No newsChannelID set.");
  } else {
    let parser = new Parser();

    (async () => {
      let feed = await parser.parseURL(
        "https://store.steampowered.com/feeds/news/app/570/?cc=FI&l=english&snr=1_2108_9__2107"
      );
      message.reply(feed.items[0].link);
    })();
  }
}

module.exports = { getLastUpdate };
