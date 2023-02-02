const { client } = require("../index");
const db = require("../db")
const fs = require("fs")

const unlinkCommand = (message) => {
    let userToDelete;
    db.Users.forEach(user => {
        if (user.DiscordID == message.author.id) {
            userToDelete = user;
        }
    });
    if (userToDelete) {
        for (let i = 0; i < db.Users.length; i++) {
            if (db.Users[i].DiscordID == message.author.id) {
                db.Users.splice(i, 1);
            }
        }
        fs.writeFile("./db.json", JSON.stringify(db, null, 2), function (err) {
            if (err) throw err;
            message.reply("Unlink successfull.");
        });
    } else {
        message.reply("No user with discord id: " + message.author.id);
    }

};

module.exports = {unlinkCommand};