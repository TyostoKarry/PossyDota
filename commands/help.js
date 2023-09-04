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
        name: "!lastmatch [match] [@user] or !lm [match] [@user]",
        value:
          "Displays basic info of last match with dotabuff link to given match." +
          "\nCan be given game number as parameter to display that most recent match." +
          "\nCan also be given another linked player as a parameter for their last match.",
      },
      {
        name: "!matchhistory [@user] or !mh [@user]",
        value:
          "Lists players stats and dotabuff links of 5 most recent games." +
          "\nAccess specific game from the dropdown menu." +
          "\nCan be given another linked player as a parameter.",
      },
      {
        name: "!mmr [match count] [@user]",
        value:
          "Displays a graph of gain or loss of mmr in 10 most recent games." +
          "\nCan be given match count as parameter. Parameter 'all' displays all valid games" +
          "\nCan also be given another linked player as a parameter for their mmr graph.",
      },
      {
        name: "!matchcount [@user] or !mc [@user]:",
        value:
          "Displays of a bar chart of the players game count in the past week." +
          "\nCan also be given another linked player as a parameter for their game count chart.",
      },
      {
        name: "!smurfs or !s",
        value: "Displays match count and rank of every player in current game.",
      },
      {
        name: "!lastupdate or !lu",
        value: "Displays most recent news post.",
      },
      {
        name: "!setnewschannel or !snc",
        value:
          "Sets the channel that the command was sent from as the channel that news posts will be posted.",
      }
    )
    .setTimestamp();

  message.reply({ embeds: [exampleEmbed], files: [attachment] });
};

module.exports = { helpCommand };
