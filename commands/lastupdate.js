const { Message } = require("discord.js");
const { client } = require("../index");
const db = require("../db");
const axios = require("axios");

async function getLastUpdate(message) {
  if (db.Data.newsChannelId == null) {
    message.reply("No newsChannelID set.");
  } else {
    try {
      const response = await axios.get(
        "http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=570&count=1&maxlength=300&format=json"
      );
      let newsPost = response.data.appnews.newsitems[0].url;
      newsPost = newsPost.replaceAll(" ", "%20");
      message.reply(newsPost);
    } catch (error) {
      message.reply("Error fetching Dota 2 update:", error);
    }
  }
}

module.exports = { getLastUpdate };
