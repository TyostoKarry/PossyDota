require("dotenv").config();
const { REST, SlashCommandBuilder, Routes } = require("discord.js");

const commands = [
  new SlashCommandBuilder().setName("dota").setDescription("basshunter"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

rest
  .put(Routes.applicationCommands("963237240056741959"), { body: commands })
  .then((data) =>
    console.log(`Successfully registered ${data.length} application commands.`)
  )
  .catch(console.error);
