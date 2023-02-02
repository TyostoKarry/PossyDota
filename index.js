require("dotenv").config();
let TOKEN = process.env.TOKEN;

const link = require('./commands/link');
const unlink = require('./commands/unlink');

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, messageLink } = require("discord.js");

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
module.exports = {client};

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.content.split(" ")[0] == '!link') {
        link.linkCommand(message);
    }
    else if (message.content == '!unlink') {
        unlink.unlinkCommand(message);
    }
});

// Log in to Discord with your client's token
client.login(TOKEN);
