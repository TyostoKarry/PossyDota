const { client } = require("../index");
const db = require("../db")
const fs = require("fs")

const linkCommand = (message) => {
    const user = {
        "DiscordName": message.author.username,
        "SteamID": message.content.split(" ")[1],
        "DiscordID": message.author.id
    }
    let exists = false;
    let duplicateUser;
    db.Users.forEach(user => {
        if (user.DiscordID == message.author.id) {
            exists = true;
            duplicateUser = user.SteamID;
        }
    });
    if (!exists) {
        db.Users.push(user);
        fs.writeFile("./db.json", JSON.stringify(db, null, 2), function (err) {
            if (err) throw err;
            message.reply("User link successfull.")
        });
    } else {
        message.reply("User already linked with Steam32 ID: " + duplicateUser);
    }
};

module.exports = {linkCommand};