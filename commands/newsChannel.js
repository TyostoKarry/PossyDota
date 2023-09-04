const { client } = require("../index");
const db = require("../db");
const fs = require("fs");

const setNewsChannel = async (message) => {
  newsChannelID = message.channelId;
  db.Data.newsChannelId = newsChannelID;
  fs.writeFile("./db.json", JSON.stringify(db, null, 2), function (err) {
    if (err) throw err;
  });
  reply = await message.reply("News channel set as <#" + newsChannelID + ">");
  return newsChannelID;
};

module.exports = { setNewsChannel };
