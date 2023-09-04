const { Message } = require("discord.js");
const { client } = require("./index");
const db = require("./db");
const axios = require("axios");
const fs = require("fs");

async function checkForUpdate() {
  if (db.Data.newsChannelId == null) {
    console.log("No newsChannelID set!");
  } else {
    try {
      const response = await axios.get(
        "http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=570&count=1&maxlength=300&format=json"
      );
      const updatedGID = response.data.appnews.newsitems[0].gid;
      if (updatedGID != db.Data.gid) {
        let newsPost = response.data.appnews.newsitems[0].url;
        newsPost = newsPost.replaceAll(" ", "%20");
        db.Data.gid = updatedGID;
        fs.writeFile("./db.json", JSON.stringify(db, null, 2), function (err) {
          if (err) throw err;
        });
        const channel = client.channels.cache.get(db.Data.newsChannelId);
        channel.send(newsPost);
      }
    } catch (error) {
      const channel = client.channels.cache.get(db.Data.newsChannelId);
      channel.send("Error fetching Dota 2 update:", error);
    }
  }
}

module.exports = { checkForUpdate };
