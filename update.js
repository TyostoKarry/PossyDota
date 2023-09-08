const { client } = require("./index");
const db = require("./db");
const fs = require("fs");
const Parser = require("rss-parser");

async function checkForUpdate() {
  if (db.Data.newsChannelId == null) {
    console.log("No newsChannelID set!");
  } else {
    let parser = new Parser();

    (async () => {
      let feed = await parser.parseURL(
        "https://store.steampowered.com/feeds/news/app/570/?cc=FI&l=english&snr=1_2108_9__2107"
      );
      const updatedGID = feed.items[0].link.split("/")[7];
      if (updatedGID != db.Data.gid) {
        const channel = client.channels.cache.get(db.Data.newsChannelId);
        channel.send(feed.items[0].link);
        db.Data.gid = updatedGID;
        fs.writeFile("./db.json", JSON.stringify(db, null, 2), function (err) {
          if (err) throw err;
        });
      }
    })();
  }
}

module.exports = { checkForUpdate };
