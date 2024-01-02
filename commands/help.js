const { client } = require("../index");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

const helpCommand = (message) => {
  const attachment = new AttachmentBuilder("./assets/dota2.jpg", "dota2.jpg");
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("Commands")
    .setAuthor({ name: "PössyDota", iconURL: "attachment://dota2.jpg" })
    .addFields(
      { name: "!help", value: "Displays available commands and their usage." },
      {
        name: "!link [Steam32ID]",
        value: "Links your Discord account to a Steam32 ID.",
      },
      { name: "!unlink", value: "Deletes the linked Steam32 ID from the Discord account." },
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
        value: "Displays ranks and games played of all the players in the previous match.",
      },
      {
        name: "!lastupdate or !lu",
        value: "Displays most recent news post.",
      },
      {
        name: "!setnewschannel or !snc",
        value:
          "Sets the channel that the command was sent from as the channel for news posts.",
      }
    )
    .setTimestamp();

  message.reply({ embeds: [exampleEmbed], files: [attachment] });
};

module.exports = { helpCommand };
