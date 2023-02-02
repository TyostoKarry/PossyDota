const { client } = require("../index");
const db = require("../db");

const helpCommand = (message) => {
    message.reply("commands: \n" +
    "!help\n!link Steam32ID\n!unlink\n" +
    "!lastmatch [match number]\n!mmr\n!smurfs");
};

module.exports = {helpCommand};