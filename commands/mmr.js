const { client } = require("../index");
const db = require("../db");
const { inputCheck, userSearch, getMatchID } = require("../myFunctions");
const fs = require("fs");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
//https://api.opendota.com/api/players/{account_id}/matches?limit=10&lobby_type=07  .player.isRadiant   .party_size
//https://api.opendota.com/api/matches/{match_id}   .radiant_win
const mmrCommand = async (message) => {
  let matchID = [],
    mmrChange;
  let params = inputCheck(message);

  if (!params) return;
  let toSearch = params[0],
    matchCount = params[1];
  if (matchCount == "all") matchCount = 100000;
  else if (matchCount < 10) matchCount = 10;
  else if (matchCount > 100000) matchCount = 100000;

  let userToSearch = userSearch(toSearch);
  if (!userToSearch) return;

  let reply = await message.reply("Fetching!");

  if (userToSearch) {
    matchID = await getMatchID(
      userToSearch,
      matchCount,
      reply,
      "&lobby_type=07"
    );
  } else {
    return reply.edit({ content: "No user found. Please link using !link." });
  }

  //Gets rid of possible undefineds from the array
  matchID = matchID.filter(function (element) {
    return element !== undefined;
  });

  if (matchID) {
    mmrChange = mmrChangeCalculate(matchID);
    await lineChartCreate(mmrChange);
    const attachment = new AttachmentBuilder(
      "./assets/mmrChangeImage.png",
      "mmrChangeImage.png"
    );

    const mmrChangeEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Mmr change graph of " + userToSearch.DiscordName)
      .addFields(
        {
          name: "About:",
          value:
            "As of patch 7.33 mmr now changes dynamically per game and is no longer predictable. " +
            "The graph shows mmr change as it was previous of patch 7.33.",
        },
        {
          name:
            "Gain/loss over " +
            matchID.length +
            " games: " +
            mmrChange[matchID.length],
          value: " ",
        }
      )
      .setTimestamp();
    mmrChangeEmbed.setImage("attachment://mmrChangeImage.png");
    reply.edit({ content: "", embeds: [mmrChangeEmbed], files: [attachment] });
  } else
    reply.edit({
      content: "Error occured fething match data.",
    });
};

//Player slots 1-127 are radiant and 128-255 are dire
//Returns an array that includes ammounts of mmr gained or lost each match
function mmrChangeCalculate(matchID) {
  let mmrGainLoss = [],
    mmrChange = [0],
    changeSoFar = 0;

  for (let match = 0; match < matchID.length; match++) {
    switch (true) {
      //Player radiant, radiant won
      case matchID[match].player_slot <= 127 && matchID[match].radiant_win:
        if (matchID[match].party_size == 1) mmrGainLoss.push(30);
        else if (matchID[match].party_size > 1) mmrGainLoss.push(20);
        else mmrGainLoss.push(20);
        break;
      //Player dire, dire won
      case matchID[match].player_slot >= 128 && !matchID[match].radiant_win:
        if (matchID[match].party_size == 1) mmrGainLoss.push(30);
        else if (matchID[match].party_size > 1) mmrGainLoss.push(20);
        else mmrGainLoss.push(20);
        break;
      //Player radiant, dire won
      case matchID[match].player_slot <= 127 && !matchID[match].radiant_win:
        if (matchID[match].party_size == 1) mmrGainLoss.push(-30);
        else if (matchID[match].party_size > 1) mmrGainLoss.push(-20);
        else mmrGainLoss.push(-20);
        break;
      //Player dire, radiant won
      case matchID[match].player_slot >= 128 && matchID[match].radiant_win:
        if (matchID[match].party_size == 1) mmrGainLoss.push(-30);
        else if (matchID[match].party_size > 1) mmrGainLoss.push(-20);
        else mmrGainLoss.push(-20);
        break;
      default:
        mmrGainLoss.push(0);
        break;
    }
  }

  //Makes the data chronological
  mmrGainLoss.reverse();

  for (let match = 0; match < matchID.length; match++) {
    changeSoFar += mmrGainLoss[match];
    mmrChange.push(changeSoFar);
  }

  return mmrChange;
}

async function lineChartCreate(mmrChange) {
  const mmrChangeLineChart = new ChartJSNodeCanvas({
    width: 800,
    height: 300,
  });

  const image = await mmrChangeLineChart.renderToBuffer({
    type: "line",
    data: {
      labels: [...Array(mmrChange.length).keys()], // generates labels
      datasets: [
        {
          label: "MMR Change",
          data: mmrChange,
          backgroundColor: "rgb(199, 10, 10)",
          borderColor: "rgb(199, 10, 10)",
        },
      ],
    },
  });

  fs.writeFile("./assets/mmrChangeImage.png", image, "base64", function (err) {
    if (err) throw err;
  });
}

module.exports = { mmrCommand };
