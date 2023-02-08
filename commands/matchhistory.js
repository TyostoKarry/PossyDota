const { client } = require("../index");
const db = require("../db");
const lobby_type = require("../lobby_type");
const heroes = require("../heroes");
const rank = require("../rank");
const axios = require("axios");
const wait = require("node:timers/promises").setTimeout;
const {
  inputCheck,
  userSearch,
  getMatchID,
  getMatchData,
  basicMatchInfoBuilder,
} = require("../myFunctions");
const {
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  Events,
} = require("discord.js");

let OverviewEmbed,
  MatchOneEmbed,
  MatchTwoEmbed,
  MatchThreeEmbed,
  MatchFourEmbed,
  MatchFiveEmbed;

const matchhistoryCommand = async (message) => {
  let userToSearch,
    matchID = [],
    matchData = [];

  userToSearch = userSearch(inputCheck(message)[0]);
  if (!userToSearch) return;

  reply = await message.reply("Fetching!");

  if (userToSearch) {
    matchID = await getMatchID(userToSearch, 5, reply);
  } else {
    return reply.edit({ content: "No user found. Please link using !link." });
  }

  if (matchID) {
    const promises = [];
    for (let match = 0; match < 5; match++) {
      promises.push(getMatchData(matchID[match], reply));
    }
    matchData = await Promise.all(promises)
      .then(async (res) => {
        return res;
      })
      .catch((err) => {
        return reply.edit({
          content: "Error occured fething match data.",
        });
      });
  } else {
    return reply.edit({
      content: "Error, no matchID found.",
    });
  }

  if (matchID.length == 5) {
    const Attachment = new AttachmentBuilder("./assets/dota2.jpg", "dota2.jpg");

    OverviewEmbed = RecentMatchesEmbed(userToSearch, matchID);
    MatchOneEmbed = basicMatchInfoBuilder(matchData[0], matchID[0]);
    MatchTwoEmbed = basicMatchInfoBuilder(matchData[1], matchID[1]);
    MatchThreeEmbed = basicMatchInfoBuilder(matchData[2], matchID[2]);
    MatchFourEmbed = basicMatchInfoBuilder(matchData[3], matchID[3]);
    MatchFiveEmbed = basicMatchInfoBuilder(matchData[4], matchID[4]);

    const RowMenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("5 most recent matches")
        .addOptions(
          {
            label: "5 most recent matches",
            value: "Overview",
          },
          {
            label: "Match: " + matchID[0].match_id,
            value: "Match1",
          },
          {
            label: "Match: " + matchID[1].match_id,
            value: "Match2",
          },
          {
            label: "Match: " + matchID[2].match_id,
            value: "Match3",
          },
          {
            label: "Match: " + matchID[3].match_id,
            value: "Match4",
          },
          {
            label: "Match: " + matchID[4].match_id,
            value: "Match5",
          }
        )
    );

    reply.edit({
      content: "",
      embeds: [OverviewEmbed],
      components: [RowMenu],
      files: [Attachment],
    });

    await wait(60000);
    reply.edit({
      components: [],
    });
  } else
    reply.edit({
      content: "Unknown error occured.",
    });
};

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  switch (interaction.values[0]) {
    case "Overview":
      interaction.message.edit({
        embeds: [OverviewEmbed],
      });
      interaction.deferUpdate();
      break;

    case "Match1":
      await interaction.message.edit({
        embeds: [MatchOneEmbed],
      });
      interaction.deferUpdate();
      break;

    case "Match2":
      await interaction.message.edit({
        embeds: [MatchTwoEmbed],
      });
      interaction.deferUpdate();
      break;

    case "Match3":
      await interaction.message.edit({
        embeds: [MatchThreeEmbed],
      });
      interaction.deferUpdate();
      break;

    case "Match4":
      await interaction.message.edit({
        embeds: [MatchFourEmbed],
      });
      interaction.deferUpdate();
      break;

    case "Match5":
      await interaction.message.edit({
        embeds: [MatchFiveEmbed],
      });
      interaction.deferUpdate();
      break;

    default:
      break;
  }
});

function RecentMatchesEmbed(userToSearch, matchID) {
  const overviewEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(
      "5 most recent matches of player " + userToSearch.DiscordName + ":"
    )
    .setAuthor({
      name: "PössyDota",
      iconURL: "attachment://dota2.jpg",
    })
    .addFields(
      {
        name: " ",
        value:
          "```Hero:                K   D   A     lobby type   average rank```",
      },
      {
        //Game 1
        name: " ",
        value: gameInfo(0, matchID),
      },
      {
        //Game 1 dotabuff and game 2
        name:
          "Dotabuff link: https://www.dotabuff.com/matches/" +
          matchID[0].match_id,
        value: gameInfo(1, matchID),
      },
      {
        //Game 2 dotabuff and game 3
        name:
          "Dotabuff link: https://www.dotabuff.com/matches/" +
          matchID[1].match_id,
        value: gameInfo(2, matchID),
      },
      {
        //Game 3 dotabuff and game 4
        name:
          "Dotabuff link: https://www.dotabuff.com/matches/" +
          matchID[2].match_id,
        value: gameInfo(3, matchID),
      },
      {
        //Game 4 dotabuff and game 5
        name:
          "Dotabuff link: https://www.dotabuff.com/matches/" +
          matchID[3].match_id,
        value: gameInfo(4, matchID),
      },
      {
        //Game 5 dotabuff
        name:
          "Dotabuff link: https://www.dotabuff.com/matches/" +
          matchID[4].match_id,
        value: " ",
      }
    )
    .setTimestamp();

  return overviewEmbed;
}

function gameInfo(game, matchID) {
  value =
    "```" +
    heroes[matchID[game].hero_id].localized_name +
    " ".repeat(19 - heroes[matchID[game].hero_id].localized_name.length) +
    " ".repeat(3 - String(matchID[game].kills).length) +
    matchID[game].kills +
    " ".repeat(4 - String(matchID[game].deaths).length) +
    matchID[game].deaths +
    " ".repeat(4 - String(matchID[game].assists).length) +
    matchID[game].assists +
    " ".repeat(
      15 -
        lobby_type[matchID[game].lobby_type].name.split("_").slice(2).join(" ")
          .length
    ) +
    lobby_type[matchID[game].lobby_type].name.split("_").slice(2).join(" ") +
    " ".repeat(15 - String(rank[matchID[game].average_rank]?.name).length) +
    rank[matchID[game].average_rank]?.name +
    "```";
  return value;
}

module.exports = { matchhistoryCommand };
