require("dotenv").config();
let TOKEN = process.env.TOKEN;

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require("discord.js");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// For use in other .js files
module.exports = { client };

const help = require("./commands/help");
const link = require("./commands/link");
const unlink = require("./commands/unlink");
const lastmatch = require("./commands/lastmatch");
const matchhistory = require("./commands/matchhistory");
const mmr = require("./commands/mmr");
const smurfs = require("./commands/smurfs");
const matchcount = require("./commands/matchcount");
const dota = require("./commands/dota");
const { Interaction } = require("chart.js");

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  client.user.setActivity("!help");
});

client.on("messageCreate", (message) => {
  if (message.content == "!help") {
    help.helpCommand(message);
  } else if (message.content.split(" ")[0] == "!link") {
    link.linkCommand(message);
  } else if (message.content == "!unlink") {
    unlink.unlinkCommand(message);
  } else if (
    message.content.split(" ")[0] == "!lastmatch" ||
    message.content.split(" ")[0] == "!lm"
  ) {
    lastmatch.lastmatchCommand(message);
  } else if (
    message.content.split(" ")[0] == "!matchhistory" ||
    message.content.split(" ")[0] == "!mh"
  ) {
    matchhistory.matchhistoryCommand(message);
  } else if (message.content.split(" ")[0] == "!mmr") {
    mmr.mmrCommand(message);
  } else if (message.content == "!smurfs" || message.content == "!s") {
    smurfs.smurfsCommand(message);
  } else if (
    message.content.split(" ")[0] == "!matchcalendar" ||
    message.content.split(" ")[0] == "!mc"
  ) {
    matchcount.matchcountCommand(message);
  }
});

client.on("interactionCreate", async (Interaction) => {
  if (Interaction.isChatInputCommand()) dota.dotaCommand(Interaction);
});

// Log in to Discord with your client's token
client.login(TOKEN);
