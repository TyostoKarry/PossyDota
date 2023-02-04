const { client } = require("../index");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

const helpCommand = (message) => {
  const attachment = new AttachmentBuilder("./assets/dota2.jpg", "dota2.jpg");
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("Commands")
    .setAuthor({ name: "PössyDota", iconURL: "attachment://dota2.jpg" })
    .addFields(
      { name: "!help", value: "Displays usable commands." },
      {
        name: "!link Steam32ID",
        value: "Links your discord user to a steam32 ID.",
      },
      { name: "!unlink", value: "Unlinks linked discord and steam32 ID." },
      {
        name: "!lastmatch [match] or !lm [match]",
        value:
          "Displays basic info of last match with dotabuff link to given match.\n" +
          "Can be given game number as parameter to display that most recent match.",
      },
      {
        name: "!matchhistory [@user] or !mh [@user]",
        value:
          "Lists players stats and dotabuff links of 5 most recent games." +
          "\nCan be given another linked player as a parameter.",
      },
      {
        name: "!mmr",
        value:
          "Displays a graph of gain or loss of mmr in 10 most recent games.",
      },
      {
        name: "!smurfs or !s",
        value: "Displays match count and rank of every player in current game.",
      }
    )
    .setTimestamp();

  message.reply({ embeds: [exampleEmbed], files: [attachment] });
};

module.exports = { helpCommand };
